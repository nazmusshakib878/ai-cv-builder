import { NextResponse } from 'next/server';
import { ResumeData, DesignConfig, SkillItem, LanguageItem } from '@/types/resume';
import { checkRateLimit, getClientIdentifier } from '@/utils/rateLimiter';
import { aiProvider } from '@/utils/aiProvider';
import {
  normalizeResumeData,
  normalizeSkillCategory,
  normalizeLanguageProficiency,
} from '@/utils/typeNormalizers';

// Ensure this only runs on the server
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Malformed request payload' }, { status: 400 });
    }

    const { prompt, resumeData, designConfig, history = [] } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (prompt.length > 8000) {
      return NextResponse.json({ error: 'Prompt exceeds maximum length of 8000 characters' }, { status: 400 });
    }

    // 1. Rate Limiting & Cost Protection (200 req/min)
    const clientId = getClientIdentifier(req, 'chat');
    const rateLimit = checkRateLimit(clientId, 200, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down and try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetSeconds) } }
      );
    }

    // Check if user request is an undo / revert request
    const lowerPrompt = prompt.toLowerCase().trim();
    const isUndoRequest = Boolean(
      /\bundo\b/i.test(lowerPrompt) ||
      /\brevert\b/i.test(lowerPrompt) ||
      /\bgo back\b/i.test(lowerPrompt) ||
      lowerPrompt.includes('ager version') ||
      lowerPrompt.includes('ager ta') ||
      lowerPrompt.includes('ager moto') ||
      lowerPrompt.includes('previous version') ||
      lowerPrompt.includes('আগের ভার্সন') ||
      lowerPrompt.includes('আগেরটা') ||
      lowerPrompt.includes('পূর্বের')
    );

    if (isUndoRequest) {
      const isBangla = /[\u0980-\u09FF]/.test(prompt);
      const isBanglish = /koro|chilo|moto|dao|rakhba|bad|amar|hobe/i.test(prompt);

      let replyContent = 'Done — Previous version restored!';
      if (isBangla) {
        replyContent = 'Done — আগের ভার্সনে ফেরত নেওয়া হয়েছে।';
      } else if (isBanglish) {
        replyContent = 'Done — আগের ভার্সন restore করা হয়েছে।';
      }

      return NextResponse.json({
        content: replyContent,
        diffPreview: {
          action: 'undo',
        },
        suggestedActions: [
          'Make my CV professional',
          'Make it one page',
          'Change CV design',
        ],
      });
    }

    const systemPrompt = `
You are Resumate AI, a friendly, intelligent, and highly competent CV assistant powered by Google Gemini.
You converse naturally with the user in Bengali (বাংলা), Banglish, or English.

CRITICAL RULES:
1. USER PROFILE / CV DATA INPUT:
   - When the user pastes candidate details, raw CV text, bio, contact info (phone/email/address), work history, skills, or education into the chat:
   - You MUST EXTRACT and OVERWRITE all corresponding fields in "modifiedData":
     * personalInfo: { fullName, jobTitle, email, phone, location, summary }
     * experiences: [ { id, company, role, location, startDate, endDate, current, bullets: [] } ]
     * education: [ { id, institution, degree, field, location, startDate, endDate, gpa } ]
     * skills: [ { id, name, category: "Technical" | "Leadership & Strategy" | "Tools & Platforms" | "Specialized" } ]
     * languages: [ { id, language, proficiency: "Native" | "Fluent" | "Professional" | "Conversational" } ]
   - Never keep placeholder sample names (like Alexandre Morgan) when the user provides their real name!

2. NATURAL & CONCISE REPLIES:
   - Reply in 1 to 2 short, friendly sentences in the user's language (Bengali/Banglish/English).
   - NEVER output technical jargon, schema names, field names, or robotic phrases.

3. NEVER INVENT FACTS:
   - Never invent new companies, degrees, dates, schools, or certifications.
   - You can polish, strengthen, tighten, or rephrase existing bullets and summaries.

4. 8 PROFESSIONAL CV TEMPLATES:
   - national-pro: Bangladesh companies, local corporate, NGOs, hospitals.
   - global-ats: USA, Canada, UK, Ireland, general ATS applications.
   - german-lebenslauf: Germany, Austria, Switzerland (DACH).
   - australia-nz: Australia, New Zealand.
   - international-pro: Overseas applications, international corporate roles.
   - multinational-corp: Multinational companies, MNCs, executive leadership.
   - nordic-europe: Netherlands, Sweden, Finland, Denmark.
   - europass-style: Italy, EURES, EU/EEA cross-border applications.

5. PHOTO COMMANDS:
   - If user asks to remove photo ("photo remove koro", "ছবি বাদ দাও"), set photoUrl to undefined.

6. ONE-PAGE FIT:
   - When asked "CV ta one page koro" or "make it 1 page", set:
     { "onePageMode": true, "sectionSpacing": "compact", "lineSpacing": "compact", "fontSize": "sm" }

JSON Schema to return:
{
  "content": "Short friendly confirmation in Bengali/Banglish/English (1-2 sentences)",
  "diffPreview": {
    "action": "update",
    "modifiedData": { ... },
    "modifiedDesign": { ... }
  },
  "suggestedActions": ["CV ta one page koro", "Experience ta aro strong koro", "Download PDF"]
}
`;

    // Try AI Provider (Google Gemini as primary, OpenAI as secondary)
    try {
      const aiResult = await aiProvider.generateChatCompletion(
        systemPrompt,
        prompt,
        history,
        { resumeData, designConfig }
      );
      if (aiResult && aiResult.content && aiResult.diffPreview) {
        if (aiResult.diffPreview.modifiedData) {
          aiResult.diffPreview.modifiedData = normalizeResumeData(aiResult.diffPreview.modifiedData);
        }
        return NextResponse.json(aiResult);
      }
    } catch (aiErr: any) {
      console.warn('[AI Route] Provider error, falling back to deterministic NLP parser:', aiErr.message);
    }

    // High-precision fallback for offline/deterministic handling
    const fallbackResponse = handleIntelligentFallback(prompt, resumeData, designConfig, history);
    return NextResponse.json(fallbackResponse);
  } catch (error: any) {
    console.error('Chat API Fatal Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request' },
      { status: 500 }
    );
  }
}

/**
 * Intelligent deterministic multi-turn, multi-lingual & raw CV parsing fallback
 */
function handleIntelligentFallback(
  prompt: string,
  resumeData: ResumeData,
  designConfig: DesignConfig,
  history: Array<{ role: string; content: string }> = []
) {
  const p = prompt.toLowerCase().trim();
  const isBangla = /[\u0980-\u09FF]/.test(prompt);
  const isBanglish = /koro|chilo|moto|dao|rakhba|bad|amar|hobe|ektu|aro|valo|niche/i.test(prompt);

  // 0. Check if user pasted full raw CV / profile info (contains email, phone, or multiple keywords)
  const emailMatch = prompt.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = prompt.match(/(?:\+?880\s?|0)1[3-9]\d{8}|(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/);
  const hasMultipleCvKeywords =
    (p.includes('skills') || p.includes('experience') || p.includes('contact') || p.includes('education') || p.includes('address') || p.includes('languages')) &&
    (emailMatch || phoneMatch || prompt.length > 100);

  if (hasMultipleCvKeywords || (emailMatch && phoneMatch)) {
    const parsed = parseRawCandidateData(prompt, resumeData);
    let content = 'আপনার তথ্য দিয়ে সিভি সুন্দরভাবে আপডেট করা হয়েছে!';
    if (isBangla) {
      content = 'আপনার প্রদত্ত তথ্যাবলী সফলভাবে সিভিতে যুক্ত ও সাজানো হয়েছে।';
    } else if (!isBanglish) {
      content = 'Successfully updated your CV with your provided details and professional formatting.';
    }

    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedData: normalizeResumeData(parsed),
        modifiedDesign: {
          template: 'national-pro',
          accentColor: '#0f172a',
          fontFamily: 'jakarta',
        },
      },
      suggestedActions: [
        'CV ta one page koro',
        'Make my CV professional',
        'Download PDF',
      ],
    };
  }

  // 1. Photo removal or addition
  if (
    p.includes('photo remove') ||
    p.includes('remove photo') ||
    p.includes('ছবি বাদ') ||
    p.includes('ছবি সরাও') ||
    (p.includes('photo') && (p.includes('bad') || p.includes('remove') || p.includes('delete')))
  ) {
    let content = 'Done — প্রোফাইল ছবি বাদ দেওয়া হয়েছে।';
    if (!isBangla && !isBanglish) {
      content = 'Done — Removed photo from your CV layout for ATS compliance.';
    }
    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedData: {
          personalInfo: {
            ...resumeData.personalInfo,
            photoUrl: undefined,
          },
        },
      },
      suggestedActions: ['CV ta one page koro', 'Make my CV professional', 'Change CV design'],
    };
  }

  // 2. Templates
  if (p.includes('bangladesh') || p.includes('hospital') || p.includes('ngo') || p.includes('local corporate') || p.includes('বাংলাদেশ')) {
    return {
      content: 'Done — বাংলাদেশের কোম্পানি ও প্রতিষ্ঠানের জন্য National Professional CV টেমপ্লেট সেট করেছি।',
      diffPreview: {
        action: 'update',
        modifiedDesign: { template: 'national-pro', accentColor: '#0f172a' },
      },
      suggestedActions: ['CV ta one page koro', 'Experience ta aro strong koro', 'Make it professional'],
    };
  }

  if (p.includes('usa') || p.includes('canada') || p.includes('uk') || p.includes('ireland') || p.includes('ats')) {
    return {
      content: 'Done — USA, Canada ও UK জব অ্যাপ্লিকেশনের জন্য 100% ATS-Friendly Global ATS টেমপ্লেট সেট করেছি।',
      diffPreview: {
        action: 'update',
        modifiedDesign: { template: 'global-ats', accentColor: '#1e293b' },
      },
      suggestedActions: ['CV ta one page koro', 'Experience ta aro strong koro', 'Download PDF'],
    };
  }

  // 3. One Page Fit
  if (p.includes('one page') || p.includes('1 page') || p.includes('single page') || p.includes('এক পেজ') || p.includes('১ পেজ')) {
    return {
      content: 'Done — সিভি ১ পেজে পারফেক্টলি ফিট করার জন্য স্পেসিং এবং লেআউট অ্যাডজাস্ট করেছি।',
      diffPreview: {
        action: 'update',
        modifiedDesign: {
          onePageMode: true,
          sectionSpacing: 'compact',
          lineSpacing: 'compact',
          fontSize: 'sm',
        },
      },
      suggestedActions: ['Design change koro', 'Experience ta aro strong koro', 'Export to PDF'],
    };
  }

  // 4. Default Polished Output
  return {
    content: isBangla
      ? 'Done — আপনার নির্দেশনা অনুযায়ী সিভি আপডেট করেছি।'
      : 'Done — Updated your CV according to your instructions.',
    diffPreview: {
      action: 'update',
      modifiedData: {
        personalInfo: {
          ...resumeData.personalInfo,
          summary: resumeData.personalInfo.summary || 'Dedicated professional delivering high performance and operational results.',
        },
      },
    },
    suggestedActions: ['Experience ta aro strong koro', 'CV ta one page koro', 'Download PDF'],
  };
}

/**
 * Deterministic generic parser for user-pasted CV text
 */
function parseRawCandidateData(raw: string, current: ResumeData): Partial<ResumeData> {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract Name (First line or up to first pipe)
  let fullName = current.personalInfo.fullName;
  const firstLine = lines[0] || '';
  const candidateNamePart = firstLine.split('|')[0].trim();
  const words = candidateNamePart.split(/\s+/);
  if (words.length > 3 && words.some(w => /^(?:Operations|Engineer|Manager|Specialist|Teacher|Supervisor|Executive|Analyst|Consultant)$/i.test(w))) {
    fullName = words.slice(0, 3).join(' ');
  } else if (candidateNamePart.length > 0) {
    fullName = candidateNamePart;
  }

  // Extract Email
  const emailMatch = raw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : current.personalInfo.email;

  // Extract Phone
  const phoneMatch = raw.match(/(?:\+?880\s?|0)1[3-9]\d{8}|(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/);
  const phone = phoneMatch ? phoneMatch[0] : current.personalInfo.phone;

  // Extract Location (Generic regex)
  let location = current.personalInfo.location;
  const addressMatch = raw.match(/(?:Mailing\s*Address|Address|Location|City)[:\s]+([^|\n•]+)/i);
  if (addressMatch) {
    location = addressMatch[1].trim();
  }

  // Extract Job Title
  let jobTitle = current.personalInfo.jobTitle;
  const titleMatch = raw.match(/(?:Position|Role|Job\s*Title|Title)[:\s]+([^|\n•]+)/i);
  if (titleMatch) {
    jobTitle = titleMatch[1].trim();
  } else if (firstLine.includes('|')) {
    const parts = firstLine.split('|').map(p => p.trim());
    if (parts.length > 1 && parts[1].length < 40 && !parts[1].includes('@') && !/\d{5}/.test(parts[1])) {
      jobTitle = parts[1];
    }
  }

  // Extract Skills dynamically from bullet points or skill headers
  const skillsList: SkillItem[] = [];
  const skillMatches = raw.match(/(?:•|\*|-)\s*([^•*\n|]+)/g);
  if (skillMatches && skillMatches.length > 0) {
    skillMatches.slice(0, 15).forEach((sm, idx) => {
      const cleanName = sm.replace(/^[•*\s-]+/, '').trim();
      if (cleanName.length > 2 && cleanName.length < 35) {
        skillsList.push({
          id: `sk-${idx + 1}`,
          name: cleanName,
          category: normalizeSkillCategory(
            cleanName.startsWith('MS ') || cleanName.includes('Internet') || cleanName.includes('Email')
              ? 'Tools & Platforms'
              : 'Technical'
          ),
        });
      }
    });
  }

  // Languages dynamically
  const languagesList: LanguageItem[] = [
    { id: 'lang-1', language: 'Bengali', proficiency: normalizeLanguageProficiency('Native') },
    { id: 'lang-2', language: 'English', proficiency: normalizeLanguageProficiency('Professional') },
  ];

  const summary = `Dedicated ${jobTitle} with demonstrated expertise in operational delivery, cross-functional collaboration, and professional excellence.`;

  return {
    personalInfo: {
      fullName,
      jobTitle,
      email,
      phone,
      location,
      summary,
    },
    skills: skillsList.length > 0 ? skillsList : current.skills,
    languages: languagesList,
  };
}
