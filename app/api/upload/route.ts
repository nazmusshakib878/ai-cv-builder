import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import { checkRateLimit, getClientIdentifier } from '@/utils/rateLimiter';
import { aiProvider } from '@/utils/aiProvider';
import { validateExtractedCV } from '@/utils/cvValidator';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Protection (30 uploads / min)
    const clientId = getClientIdentifier(req, 'upload');
    const rateLimit = checkRateLimit(clientId, 30, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many upload requests. Please wait a minute and try again.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetSeconds) } }
      );
    }

    let extractedText = '';
    let isImage = false;
    let imageBuffer: Buffer | null = null;
    let imageMimeType = 'image/jpeg';

    const contentType = req.headers.get('content-type') || '';

    // Handle Direct JSON payload (e.g. from Tell AI about me / raw text paste)
    if (contentType.includes('application/json')) {
      const body = await req.json().catch(() => null);
      if (body && typeof body.text === 'string' && body.text.trim().length > 0) {
        extractedText = body.text.trim();
      } else {
        return NextResponse.json({ error: 'No text provided in request' }, { status: 400 });
      }
    } else {
      // Handle Multipart Form Data file upload
      const formData = await req.formData().catch(() => null);
      if (!formData) {
        return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
      }

      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      // 2. File Size Validation (Max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 400 });
      }

      const fileNameLower = (file.name || '').toLowerCase();

      // 3. File Type Whitelist Validation
      const isAllowedExt =
        fileNameLower.endsWith('.pdf') ||
        fileNameLower.endsWith('.docx') ||
        fileNameLower.endsWith('.doc') ||
        fileNameLower.endsWith('.txt') ||
        fileNameLower.endsWith('.jpg') ||
        fileNameLower.endsWith('.jpeg') ||
        fileNameLower.endsWith('.png');

      if (!isAllowedExt) {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload a PDF, DOCX, TXT, or JPG/PNG image.' },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (fileNameLower.endsWith('.pdf') || file.type === 'application/pdf') {
        try {
          const pdfData = await pdfParse(buffer);
          extractedText = pdfData.text;
        } catch (pdfErr) {
          return NextResponse.json(
            { error: 'Could not read PDF contents. Please ensure the file is not corrupted or password protected.' },
            { status: 400 }
          );
        }
      } else if (
        fileNameLower.endsWith('.docx') ||
        fileNameLower.endsWith('.doc') ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        try {
          const result = await mammoth.extractRawText({ buffer });
          extractedText = result.value;
        } catch (docxErr) {
          return NextResponse.json({ error: 'Could not read Word document contents.' }, { status: 400 });
        }
      } else if (fileNameLower.endsWith('.txt') || file.type === 'text/plain') {
        extractedText = buffer.toString('utf-8');
      } else if (
        fileNameLower.endsWith('.jpg') ||
        fileNameLower.endsWith('.jpeg') ||
        fileNameLower.endsWith('.png') ||
        file.type.startsWith('image/')
      ) {
        isImage = true;
        imageBuffer = buffer;
        imageMimeType = file.type || 'image/jpeg';
      }
    }

    // 4. Multimodal Vision Analysis for Image Uploads
    if (isImage && imageBuffer) {
      try {
        const parsedImageCV = await aiProvider.analyzeImageOrDocumentCV(
          imageBuffer.toString('base64'),
          imageMimeType
        );
        if (parsedImageCV && parsedImageCV.personalInfo) {
          const validation = validateExtractedCV('', parsedImageCV);
          return NextResponse.json({
            success: true,
            resumeData: validation.sanitizedData,
            providerUsed: 'gemini',
          });
        }
      } catch (visionErr: any) {
        console.warn('Gemini vision parsing error:', visionErr.message);
      }

      return NextResponse.json(
        { error: 'আমরা আপনার ছবির CV সঠিকভাবে পড়তে পারিনি। দয়া করে PDF অথবা স্পষ্ট ছবি আপলোড করুন।' },
        { status: 422 }
      );
    }

    // 5. High-Fidelity AI Text Extraction for Document / Raw Text
    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json(
        { error: 'The uploaded document contains no readable text.' },
        { status: 400 }
      );
    }

    // Allow up to 25,000 characters (preserving full 5-6 page CVs)
    const textToProcess = extractedText.slice(0, 25000);

    let extractedData = null;
    let providerUsed: 'gemini' | 'openai' = 'gemini';

    // Attempt 1: High-Fidelity Extraction
    try {
      const result = await aiProvider.extractFullCVFromText(textToProcess, false);
      extractedData = result.data;
      providerUsed = result.providerUsed;
    } catch (err: any) {
      console.warn('AI Extraction Attempt 1 failed:', err.message);
    }

    // Validate Attempt 1
    let validation = validateExtractedCV(textToProcess, extractedData || {});

    // Attempt 2: If validation failed, retry with high-priority strict mode
    if (!validation.isValid) {
      console.warn('Extraction validation failed attempt 1 reasons:', validation.reasons);
      try {
        const retryResult = await aiProvider.extractFullCVFromText(textToProcess, true);
        validation = validateExtractedCV(textToProcess, retryResult.data || {});
        if (validation.isValid) {
          extractedData = retryResult.data;
          providerUsed = retryResult.providerUsed;
        }
      } catch (retryErr: any) {
        console.warn('AI Extraction Attempt 2 (Retry) failed:', retryErr.message);
      }
    }

    // 6. NEVER SILENTLY RETURN LOW QUALITY DUMMY DATA
    if (!validation.isValid) {
      console.error('Final validation failed for CV extraction:', validation.reasons);
      return NextResponse.json(
        {
          error: 'আমরা আপনার CV সঠিকভাবে পড়তে পারিনি। আবার চেষ্টা করুন।',
          details: validation.reasons,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      resumeData: validation.sanitizedData,
      providerUsed,
    });
  } catch (error: any) {
    console.error('Upload API Fatal Error:', error);
    return NextResponse.json(
      { error: error.message || 'File parsing failed. Please try again.' },
      { status: 500 }
    );
  }
}
