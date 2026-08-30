import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from '@/utils/authServer';
import { db } from '@/utils/supabase/db';
import { chromium } from 'playwright';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(req);
    const body = await req.json().catch(() => ({}));
    const { resumeId, resumeData, config } = body;

    // 1. Validate Resume ID & Ownership
    if (!resumeId) {
      return NextResponse.json(
        { error: 'Missing required resumeId for download validation.' },
        { status: 400 }
      );
    }

    const verifiedResume = await db.getResume(resumeId, session.userId, session.guestSessionId);
    if (!verifiedResume) {
      return NextResponse.json(
        { error: 'Resume not found or you do not have permission to access it.' },
        { status: 404 }
      );
    }

    // 2. STRICT SERVER PAYMENT VERIFICATION: Verify genuine paid status in DB
    if (!verifiedResume.is_paid) {
      return NextResponse.json(
        { error: 'Payment required to download this CV.' },
        { status: 402 } // 402 Payment Required
      );
    }

    const dataToRender = resumeData || verifiedResume.data;
    const configToRender = config || verifiedResume.design;

    // 3. Render PDF using Playwright with Docker/Linux container safety flags
    const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined;
    const browser = await chromium.launch({
      headless: true,
      executablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
      ],
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const renderUrl = `${protocol}://${host}/render-cv`;

    await page.goto(renderUrl, { waitUntil: 'networkidle' });

    await page.evaluate(({ resumeData, config }) => {
      (window as any).__INJECTED_RESUME_DATA__ = resumeData;
      (window as any).__INJECTED_CONFIG__ = config;
      window.dispatchEvent(new Event('resume-data-ready'));
    }, { resumeData: dataToRender, config: configToRender });

    await page.waitForTimeout(400);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    await browser.close();

    const fileName = `${(dataToRender.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}_CV.pdf`;

    return new Response(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF.' }, { status: 500 });
  }
}
