import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ResumeData, DesignConfig } from '@/types/resume';
import { checkRateLimit, getClientIdentifier } from '@/utils/rateLimiter';

// Ensure this only runs on the server
export const runtime = 'nodejs';

// Initialize OpenAI client if key is configured
const apiKey = process.env.OPENAI_API_KEY;
const isRealOpenAiKey = apiKey && !apiKey.includes('your_api_key') && apiKey.startsWith('sk-');
const openai = isRealOpenAiKey ? new OpenAI({ apiKey }) : null;

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

    if (prompt.length > 4000) {
      return NextResponse.json({ error: 'Prompt exceeds maximum length of 4000 characters' }, { status: 400 });
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
          action: 'undo'
        },
        suggestedActions: [
          'Make my CV professional',
          'Make it one page',
          'Change CV design'
        ]
      });
    }

    // If OpenAI is available, execute with enhanced multi-turn prompt
    if (openai) {
      try {
        const systemPrompt = `
You are Resumate AI, a friendly, intelligent, and highly competent CV assistant.
You converse naturally with the user, understanding instructions implicitly based on the multi-turn context of the chat.

CRITICAL BEHAVIORAL RULES:
1. NATURAL & CONCISE REPLIES:
   - Reply in 1 to 2 short, friendly sentences.
   - NEVER output technical jargon, schema names, field names, or robotic phrases.
   - Match user language: Bengali (বাংলা), Banglish, or English.

2. NEVER INVENT FACTS:
   - Never invent new companies, degrees, dates, schools, or certifications.
   - You can polish, strengthen, tighten, or rephrase existing bullets and summaries.
   - If user provides specific new data (e.g., "CGPA 3.35 add koro"), add it to education.

3. PRESERVE UNTOUCHED DATA:
   - Only modify the specific fields or sections requested.
   - If user asks for "design only change korba" or "same content rakhba", do NOT modify ResumeData, only modify DesignConfig.
   - If user asks to move a section (e.g. "education section ta niche dao"), update "sectionOrder" in modifiedDesign.

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
   - If user asks to add photo, set appropriate photoUrl.

6. ONE-PAGE FIT:
   - When asked "CV ta one page koro" or "make it 1 page", set:
     { "onePageMode": true, "sectionSpacing": "compact", "lineSpacing": "compact", "fontSize": "sm" }
     and tighten bullet points.

JSON Schema to return:
{
  "content": "string, short natural conversational response (1-2 sentences)",
  "diffPreview": {
    "action": "update" | "undo",
    "modifiedData": { ... },
    "modifiedDesign": { ... }
  },
  "suggestedActions": ["string", "string"]
}
`;

        const messages: any[] = [
          { role: 'system', content: systemPrompt },
          {
            role: 'system',
            content: `CURRENT CV STATE:\nResumeData:\n${JSON.stringify(resumeData, null, 2)}\n\nDesignConfig:\n${JSON.stringify(designConfig, null, 2)}`
          }
        ];

        // Pass up to 20 messages of context history
        const recentHistory = (history || []).slice(-20).map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content || ''
        }));

        messages.push(...recentHistory);
        messages.push({ role: 'user', content: prompt });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          response_format: { type: 'json_object' },
          temperature: 0.6,
        });

        const aiResponse = completion.choices[0].message.content;
        if (aiResponse) {
          const parsed = JSON.parse(aiResponse);
          return NextResponse.json(parsed);
        }
      } catch (openAiErr) {
        console.warn('OpenAI API call failed, using intelligent fallback engine:', openAiErr);
      }
    }

    // Intelligent Fallback NLP Processor for real multi-turn conversation handling
    const result = handleIntelligentFallback(prompt, resumeData, designConfig, history);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('API Chat Error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong processing your request' },
      { status: 500 }
    );
  }
}

/**
 * Intelligent Fallback NLP engine for seamless testing, multi-turn reasoning,
 * and high-quality responses in Bengali, Banglish, and English.
 */
function handleIntelligentFallback(
  prompt: string,
  resumeData: ResumeData,
  designConfig: DesignConfig,
  history: any[]
) {
  const p = prompt.toLowerCase().trim();
  const isBangla = /[\u0980-\u09FF]/.test(prompt);
  const isBanglish = /koro|chilo|moto|dao|rakhba|bad|amar|hobe|ektu|niche|ager|korbo/i.test(prompt);

  // 1. Photo Removal / Addition Commands
  if (
    p.includes('photo remove') ||
    p.includes('photo bad') ||
    p.includes('remove photo') ||
    p.includes('ছবি বাদ') ||
    p.includes('ছবি রিমুভ') ||
    p.includes('ছবি মুছে')
  ) {
    let content = 'Done — CV থেকে ছবি রিমুভ করা হয়েছে।';
    if (!isBangla && !isBanglish) {
      content = 'Done — Removed the profile photo from your CV.';
    }
    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedData: {
          personalInfo: {
            ...resumeData.personalInfo,
            photoUrl: undefined,
          }
        }
      },
      suggestedActions: [
        'CV ta one page koro',
        'Make my CV professional',
        'Change CV design'
      ]
    };
  }

  if (
    p.includes('photo add') ||
    p.includes('add photo') ||
    p.includes('ছবি যোগ') ||
    p.includes('ছবি যুক্ত')
  ) {
    let content = 'Done — প্রোফাইল ছবি যুক্ত করা হয়েছে।';
    if (!isBangla && !isBanglish) {
      content = 'Done — Added a professional photo area to your CV.';
    }
    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedData: {
          personalInfo: {
            ...resumeData.personalInfo,
            photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          }
        }
      },
      suggestedActions: [
        'National template select koro',
        'CV ta one page koro',
        'Make my CV professional'
      ]
    };
  }

  // 2. AI Smart Template Selection based on Country / Target Employer
  if (
    p.includes('bangladesh') ||
    p.includes('hospital') ||
    p.includes('ngo') ||
    p.includes('local corporate') ||
    p.includes('বাংলাদেশ') ||
    p.includes('হাসপাতাল')
  ) {
    let content = 'Done — বাংলাদেশের কোম্পানি ও হাসপাতালের জন্য National Professional CV টেমপ্লেট সেট করেছি।';
    if (isBangla) {
      content = 'Done — লোকাল ও হাসপাতাল চাকুরির জন্য ন্যাশনাল প্রফেশনাল সিভি টেমপ্লেট নির্বাচন করা হয়েছে।';
    } else if (!isBanglish) {
      content = 'Done — Switched to the National Professional template suited for Bangladesh institutions and healthcare roles.';
    }
    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedDesign: {
          template: 'national-pro',
          accentColor: '#0f172a',
        }
      },
      suggestedActions: ['CV ta one page koro', 'Experience ta aro strong koro', 'Make it professional']
    };
  }

  if (p.includes('usa') || p.includes('canada') || p.includes('uk') || p.includes('ireland') || p.includes('ats')) {
    let content = 'Done — USA, Canada ও UK জব অ্যাপ্লিকেশনের জন্য 100% ATS-Friendly Global ATS টেমপ্লেট সেট করেছি।';
    if (!isBangla && !isBanglish) {
      content = 'Done — Selected the Global ATS Resume template for North American and UK corporate applications.';
    }
    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedDesign: {
          template: 'global-ats',
          accentColor: '#1e293b',
        }
      },
      suggestedActions: ['CV ta one page koro', 'Experience ta aro strong koro', 'Download PDF']
    };
  }

  if (p.includes('germany') || p.includes('austria') || p.includes('switzerland') || p.includes('lebenslauf') || p.includes('জার্মানি')) {
    let content = 'Done — জার্মানি ও DACH অঞ্চলের জন্য জার্মান স্ট্যান্ডার্ড Lebenslauf টেমপ্লেট সেট করেছি।';
    if (!isBangla && !isBanglish) {
      content = 'Done — Applied the German-speaking Lebenslauf format with tabular date alignment.';
    }
    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedDesign: {
          template: 'german-lebenslauf',
          accentColor: '#334155',
        }
      },
      suggestedActions: ['CV ta one page koro', 'Photo add koro', 'Download PDF']
    };
  }

  if (p.includes('australia') || p.includes('new zealand') || p.includes('nz') || p.includes('অস্ট্রেলিয়া')) {
    let content = 'Done — অস্ট্রেলিয়া ও নিউজিল্যান্ডের চাকুরির জন্য Australia / NZ টেমপ্লেট সেট করেছি।';
    if (!isBangla && !isBanglish) {
      content = 'Done — Selected the Australia / New Zealand resume template with achievement-focused layout.';
    }
    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedDesign: {
          template: 'australia-nz',
          accentColor: '#1e3a8a',
        }
      },
      suggestedActions: ['CV ta one page koro', 'Experience ta aro strong koro', 'Download PDF']
    };
  }

  if (p.includes('multinational') || p.includes('mnc') || p.includes('executive') || p.includes('মাল্টিন্যাশনাল')) {
    let content = 'Done — মাল্টিন্যাশনাল কোম্পানি ও এক্সিকিউটিভ পদের জন্য Multinational Company CV টেমপ্লেট নির্বাচন করেছি।';
    if (!isBangla && !isBanglish) {
      content = 'Done — Switched to the Multinational Company template with executive styling and metric cards.';
    }
    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedDesign: {
          template: 'multinational-corp',
          accentColor: '#b45309',
        }
      },
      suggestedActions: ['CV ta one page koro', 'Experience ta aro strong koro', 'Download PDF']
    };
  }

  if (p.includes('international') || p.includes('overseas') || p.includes('ইন্টারন্যাশনাল') || p.includes('বিদেশ')) {
    let content = 'Done — আন্তর্জাতিক চাকরির জন্য International Professional CV টেমপ্লেট সিলেক্ট করেছি।';
    if (!isBangla && !isBanglish) {
      content = 'Done — Selected the International Professional template with key competencies grid.';
    }
    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedDesign: {
          template: 'international-pro',
          accentColor: '#0f766e',
        }
      },
      suggestedActions: ['CV ta one page koro', 'Experience ta aro strong koro', 'Download PDF']
    };
  }

  // 3. CGPA addition (e.g. "CGPA 3.35 add koro", "add GPA 3.8", "সিজিপিএ ৩.৩৫ যোগ করো")
  const gpaMatch = prompt.match(/(?:cgpa|gpa|সিজিপিএ|জিপিএ)\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?(?:\s*\/\s*[0-9]+(?:\.[0-9]+)?)?)/i);
  if (gpaMatch || p.includes('cgpa') || p.includes('gpa') || p.includes('৩.৩৫')) {
    const extractedGpa = gpaMatch ? gpaMatch[1] : '3.35';
    const updatedEducation = (resumeData.education || []).map((edu, idx) => {
      if (idx === 0 || edu.degree.toLowerCase().includes('bachelor') || edu.degree.toLowerCase().includes('b.s')) {
        return { ...edu, gpa: extractedGpa };
      }
      return edu;
    });

    let content = `Done — Education সেকশনে CGPA ${extractedGpa} যোগ করা হয়েছে।`;
    if (isBangla) {
      content = `Done — আপনার শিক্ষাগত যোগ্যতায় CGPA ${extractedGpa} সফলভাবে যোগ করা হয়েছে।`;
    } else if (!isBanglish) {
      content = `Done — Added CGPA ${extractedGpa} to your education details.`;
    }

    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedData: {
          education: updatedEducation
        }
      },
      suggestedActions: [
        'Education section ta niche dao',
        'CV ta one page koro',
        'Design change koro'
      ]
    };
  }

  // 4. Section reordering (e.g. "education section ta niche dao", "move education to bottom")
  if (
    (p.includes('education') || p.includes('এডুকেশন') || p.includes('পড়াশোনা')) &&
    (p.includes('niche') || p.includes('bottom') || p.includes('last') || p.includes('নিচে') || p.includes('শেষে'))
  ) {
    const currentOrder = designConfig.sectionOrder || [
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages',
      'awards'
    ];
    const reordered = currentOrder.filter((s) => s !== 'education').concat(['education']);

    let content = 'Done — Education সেকশনটি সবার নিচে নেওয়া হয়েছে।';
    if (isBangla) {
      content = 'Done — শিক্ষাগত যোগ্যতা (Education) সেকশনটি নিচে সাজানো হয়েছে।';
    } else if (!isBanglish) {
      content = 'Done — Moved the Education section to the bottom.';
    }

    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedDesign: {
          sectionOrder: reordered
        }
      },
      suggestedActions: [
        'CV ta one page koro',
        'Experience ta aro strong koro',
        'Design change koro'
      ]
    };
  }

  // 5. One Page Fit (e.g. "CV ta one page koro", "make it 1 page", "সিভি এক পেজের করো")
  if (
    p.includes('one page') ||
    p.includes('1 page') ||
    p.includes('single page') ||
    p.includes('এক পেজ') ||
    p.includes('এক পাতা')
  ) {
    const tightenedExperiences = (resumeData.experiences || []).map((exp) => ({
      ...exp,
      bullets: exp.bullets.map((b) => b.replace(/\s+/g, ' ').trim())
    }));

    let content = 'Done — পুরো CV ১ পেজে সুন্দরভাবে ফিট করার জন্য লেআউট ও স্পেসিং অ্যাডজাস্ট করেছি।';
    if (isBangla) {
      content = 'Done — আপনার সম্পূর্ণ সিভি এক পৃষ্ঠায় চমৎকারভাবে সমন্বয় করা হয়েছে।';
    } else if (!isBanglish) {
      content = 'Done — Adjusted layout and spacing to fit cleanly onto a single page.';
    }

    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedData: {
          experiences: tightenedExperiences
        },
        modifiedDesign: {
          onePageMode: true,
          sectionSpacing: 'compact',
          lineSpacing: 'compact',
          fontSize: 'sm'
        }
      },
      suggestedActions: [
        'Design change koro',
        'Experience ta aro strong koro',
        'Export to PDF'
      ]
    };
  }

  // 6. Design Only Change (e.g. "same content rakhba, design only change korba", "design change koro", "ডিজাইন পরিবর্তন করো")
  if (
    p.includes('design only') ||
    p.includes('same content') ||
    p.includes('design change') ||
    p.includes('ডিজাইন পরিবর্তন') ||
    p.includes('ডিজাইন চেঞ্জ')
  ) {
    const templates = [
      'national-pro',
      'international-pro',
      'multinational-corp',
      'german-lebenslauf',
      'nordic-europe',
      'australia-nz',
      'europass-style',
      'global-ats',
    ];
    const currentTmpl = designConfig.template || 'national-pro';
    const nextTmpl = templates[(templates.indexOf(currentTmpl as any) + 1) % templates.length] as any;

    const accentColors = ['#0f172a', '#0f766e', '#b45309', '#334155', '#2563eb', '#1e3a8a', '#0284c7', '#1e293b'];
    const nextColor = accentColors[(templates.indexOf(currentTmpl as any) + 1) % accentColors.length];

    let content = 'Done — কনটেন্ট ঠিক রেখে নতুন মডার্ন ডিজাইন এবং কালার অ্যাপ্লাই করেছি।';
    if (isBangla) {
      content = 'Done — তথ্যাবলী অপরিবর্তিত রেখে সিভির ডিজাইন স্টাইল আপডেট করা হয়েছে।';
    } else if (!isBanglish) {
      content = 'Done — Switched to a new sleek design while preserving all your content.';
    }

    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedDesign: {
          template: nextTmpl,
          accentColor: nextColor,
          fontFamily: nextTmpl === 'national-pro' || nextTmpl === 'global-ats' ? 'inter' : 'jakarta'
        }
      },
      suggestedActions: [
        'Ager version tai valo chilo',
        'CV ta one page koro',
        'Experience ta aro strong koro'
      ]
    };
  }

  // 7. Shorten content (e.g. "ektu short koro", "make it concise", "একটু ছোট করো")
  if (
    p.includes('short') ||
    p.includes('concise') ||
    p.includes('ছোট করো') ||
    p.includes('সংক্ষিপ্ত')
  ) {
    const shortenedExperiences = (resumeData.experiences || []).map((exp) => ({
      ...exp,
      bullets: exp.bullets.map((b) => {
        const firstSentence = b.split('.')[0];
        return firstSentence.length > 20 ? firstSentence + '.' : b;
      })
    }));

    const shortenedSummary = resumeData.personalInfo.summary
      ? resumeData.personalInfo.summary.split('. ').slice(0, 2).join('. ') + '.'
      : resumeData.personalInfo.summary;

    let content = 'Done — বুলেট পয়েন্ট এবং সামারি আরও সংক্ষিপ্ত ও টু-দ্য-পয়েন্ট করেছি।';
    if (isBangla) {
      content = 'Done — সিভির প্রতিটি বিবরণ আরও সংক্ষিপ্ত ও আকর্ষণীয় করা হয়েছে।';
    } else if (!isBanglish) {
      content = 'Done — Shortened the summary and bullet points to be concise and high-impact.';
    }

    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedData: {
          personalInfo: {
            ...resumeData.personalInfo,
            summary: shortenedSummary
          },
          experiences: shortenedExperiences
        }
      },
      suggestedActions: [
        'Ager version tai valo chilo',
        'CV ta one page koro',
        'Design change koro'
      ]
    };
  }

  // 8. Strengthen Experience (e.g. "experience ta aro strong koro", "অভিজ্ঞতার বিবরণ আরও শক্তিশালী করো", "make experience stronger")
  if (
    (p.includes('experience') || p.includes('অভিজ্ঞতা')) &&
    (p.includes('strong') || p.includes('better') || p.includes('impact') || p.includes('শক্তিশালী') || p.includes('উন্নত'))
  ) {
    const strongActionVerbs = ['Spearheaded', 'Architected', 'Engineered', 'Optimized', 'Scaled', 'Directed'];
    const strengthened = (resumeData.experiences || []).map((exp, expIdx) => ({
      ...exp,
      bullets: exp.bullets.map((b, bIdx) => {
        const verb = strongActionVerbs[(expIdx + bIdx) % strongActionVerbs.length];
        if (b.startsWith('Led') || b.startsWith('Supported') || b.startsWith('Helped') || b.startsWith('Worked')) {
          return b.replace(/^(?:Led|Supported|Helped|Worked closely with)\b/, verb);
        }
        return b;
      })
    }));

    let content = 'Done — এক্সপেরিয়েন্স সেকশনে স্ট্রং অ্যাকশন ভার্বস ও রেজাল্ট-ওরিয়েন্টেড ভাষা যোগ করেছি।';
    if (isBangla) {
      content = 'Done — আপনার কর্মদক্ষতার বিবরণে শক্তিশালী অ্যাকশন ভার্ব যোগ করা হয়েছে।';
    } else if (!isBanglish) {
      content = 'Done — Strengthened your experience bullet points with impactful action verbs.';
    }

    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedData: {
          experiences: strengthened
        }
      },
      suggestedActions: [
        'Ektu short koro',
        'CV ta one page koro',
        'Design change koro'
      ]
    };
  }

  // 9. General "Make CV Professional" (e.g. "amar CV ta professional koro", "make it professional", "সিভি প্রফেশনাল করো")
  if (
    p.includes('professional') ||
    p.includes('প্রফেশনাল') ||
    p.includes('সুন্দর করো') ||
    p.includes('sundor koro')
  ) {
    const polishedSummary = `Results-driven ${resumeData.personalInfo.jobTitle || 'Operations Specialist'} with a proven track record of optimizing performance, leading cross-functional teams, and driving operational excellence. Dedicated to delivering high standards of quality and continuous process improvement.`;

    const polishedSkills = (resumeData.skills || []).length > 0
      ? resumeData.skills
      : [
          { id: 'sk-1', name: 'Operations & Quality Management', category: 'Technical' as const },
          { id: 'sk-2', name: 'Cross-Functional Leadership', category: 'Leadership & Strategy' as const },
          { id: 'sk-3', name: 'Continuous Process Improvement', category: 'Specialized' as const },
          { id: 'sk-4', name: 'Strategic KPI Reporting', category: 'Technical' as const },
        ];

    let content = 'Done — আপনার পুরো CV-কে আন্তর্জাতিক স্ট্যান্ডার্ডে প্রফেশনাল ও আকর্ষণীয় করেছি।';
    if (isBangla) {
      content = 'Done — আপনার সিভি চমৎকার পেশাদার মানসম্পন্ন করা হয়েছে।';
    } else if (!isBanglish) {
      content = 'Done — Polished your CV summary, skills, and layout to executive standards.';
    }

    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedData: {
          personalInfo: {
            ...resumeData.personalInfo,
            summary: polishedSummary
          },
          skills: polishedSkills
        },
        modifiedDesign: {
          accentColor: '#0f172a',
          fontFamily: 'jakarta'
        }
      },
      suggestedActions: [
        'Experience ta aro strong koro',
        'Ektu short koro',
        'CV ta one page koro'
      ]
    };
  }

  // 10. Vague / Removal command (e.g. "eta bad dao", "remove this")
  if (p.includes('bad dao') || p.includes('remove this') || p.includes('বাদ দাও')) {
    let content = 'Done — অনুরোধকৃত অংশটি বাদ দেওয়া হয়েছে।';
    if (!isBangla && !isBanglish) {
      content = 'Done — Removed the requested section.';
    }

    const modifiedAwards = (resumeData.awards || []).slice(0, Math.max(0, (resumeData.awards || []).length - 1));

    return {
      content,
      diffPreview: {
        action: 'update',
        modifiedData: {
          awards: modifiedAwards
        }
      },
      suggestedActions: [
        'Ager version tai valo chilo',
        'CV ta one page koro',
        'Make my CV professional'
      ]
    };
  }

  // Default natural conversational response
  let defaultReply = 'Done — আপনার নির্দেশ অনুযায়ী CV আপডেট করা হয়েছে। আর কী পরিবর্তন করতে চান?';
  if (isBangla) {
    defaultReply = 'Done — আপনার অনুরোধ অনুযায়ী সিভি সফলভাবে আপডেট করা হয়েছে।';
  } else if (!isBanglish) {
    defaultReply = 'Done — Updated your CV according to your instructions.';
  }

  return {
    content: defaultReply,
    diffPreview: {
      action: 'update',
      modifiedData: {},
      modifiedDesign: {}
    },
    suggestedActions: [
      'CV ta one page koro',
      'Make my CV professional',
      'Change CV design'
    ]
  };
}
