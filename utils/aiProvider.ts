import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { ResumeData, DesignConfig } from '@/types/resume';

export interface AIResponse {
  content: string;
  diffPreview?: {
    action: 'update' | 'undo';
    modifiedData?: Partial<ResumeData>;
    modifiedDesign?: Partial<DesignConfig>;
  };
  suggestedActions?: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function timeoutPromise<T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(errorMsg)), ms);
    promise
      .then(res => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

class AIProviderService {
  private geminiClient: GoogleGenerativeAI | null = null;
  private openaiClient: OpenAI | null = null;
  private primaryProvider: 'gemini' | 'openai' = 'gemini';

  constructor() {
    const providerEnv = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
    this.primaryProvider = providerEnv === 'openai' ? 'openai' : 'gemini';

    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      this.geminiClient = new GoogleGenerativeAI(geminiKey);
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      this.openaiClient = new OpenAI({ apiKey: openaiKey });
    }
  }

  public getProviderName(): string {
    return this.primaryProvider;
  }

  /**
   * Main chat completion with automatic model fallback
   */
  public async generateChatCompletion(
    systemPrompt: string,
    userPrompt: string,
    history: ChatMessage[] = [],
    contextData?: { resumeData?: ResumeData; designConfig?: DesignConfig }
  ): Promise<AIResponse> {
    if (this.primaryProvider === 'gemini' && this.geminiClient) {
      try {
        return await this.callGemini(systemPrompt, userPrompt, history, contextData);
      } catch (err: any) {
        console.warn(`[AI Provider] Gemini call failed (${err.message}). Trying fallback...`);
      }
    }

    if (this.primaryProvider === 'openai' && this.openaiClient) {
      try {
        return await this.callOpenAI(systemPrompt, userPrompt, history, contextData);
      } catch (err: any) {
        console.warn(`[AI Provider] OpenAI call failed (${err.message})...`);
      }
    }

    throw new Error('AI Provider unavailable or exhausted.');
  }

  /**
   * Call Google Gemini API (3.6 / 3.7 Flash free tier) with timeout
   */
  private async callGemini(
    systemPrompt: string,
    userPrompt: string,
    history: ChatMessage[] = [],
    contextData?: { resumeData?: ResumeData; designConfig?: DesignConfig }
  ): Promise<AIResponse> {
    if (!this.geminiClient) throw new Error('Gemini client not initialized.');

    const models = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.5-flash', 'gemini-3.7-flash'];
    let lastError: any = null;

    const fullPrompt = `
${systemPrompt}

CURRENT RESUME DATA:
${JSON.stringify(contextData?.resumeData || {}, null, 2)}

CURRENT DESIGN CONFIG:
${JSON.stringify(contextData?.designConfig || {}, null, 2)}

RECENT CONVERSATION HISTORY:
${history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

USER REQUEST:
${userPrompt}

IMPORTANT: Respond with ONLY a valid JSON object matching the schema. No markdown backticks, no markdown code fence.`;

    for (const modelName of models) {
      try {
        const model = this.geminiClient.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        });

        const result = await timeoutPromise(
          model.generateContent(fullPrompt),
          8000,
          `Gemini model ${modelName} timed out after 8s`
        );

        const text = result.response.text();
        const cleaned = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return {
          content: parsed.content || 'Done.',
          diffPreview: parsed.diffPreview,
          suggestedActions: parsed.suggestedActions || ['CV ta one page koro', 'Experience ta aro strong koro', 'Download PDF'],
        };
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini] ${modelName} attempt failed: ${err.message}. Trying next model...`);
      }
    }

    throw lastError || new Error('All Gemini models failed.');
  }

  /**
   * Call OpenAI API (Optional future provider)
   */
  private async callOpenAI(
    systemPrompt: string,
    userPrompt: string,
    history: ChatMessage[] = [],
    contextData?: { resumeData?: ResumeData; designConfig?: DesignConfig }
  ): Promise<AIResponse> {
    if (!this.openaiClient) throw new Error('OpenAI client not initialized.');

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map(
        (m): OpenAI.Chat.ChatCompletionMessageParam => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })
      ),
      {
        role: 'user',
        content: `Current Resume Data: ${JSON.stringify(
          contextData?.resumeData || {}
        )}\n\nUser Request: ${userPrompt}`,
      },
    ];

    const completion = await timeoutPromise(
      this.openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
      8000,
      'OpenAI call timed out after 8s'
    );

    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return {
      content: parsed.content || 'Done.',
      diffPreview: parsed.diffPreview,
      suggestedActions: parsed.suggestedActions || [],
    };
  }

  /**
   * Vision & Document Understanding via Gemini Multimodal API
   */
  public async analyzeImageOrDocumentCV(
    fileBase64: string,
    mimeType: string,
    instruction: string = 'Extract and structure all CV information into professional JSON format.'
  ): Promise<Partial<ResumeData>> {
    if (!this.geminiClient) {
      throw new Error('Gemini API client is required for multimodal vision analysis.');
    }

    const models = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.5-flash-image'];

    const prompt = `
${instruction}

Extract all information and return ONLY a JSON object with this structure:
{
  "personalInfo": {
    "fullName": "...",
    "jobTitle": "...",
    "email": "...",
    "phone": "...",
    "location": "...",
    "summary": "..."
  },
  "experiences": [
    {
      "id": "exp-1",
      "company": "...",
      "role": "...",
      "location": "...",
      "startDate": "...",
      "endDate": "...",
      "current": false,
      "bullets": ["..."]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "...",
      "degree": "...",
      "field": "...",
      "location": "...",
      "startDate": "...",
      "endDate": "...",
      "gpa": "..."
    }
  ],
  "skills": [
    {
      "id": "sk-1",
      "name": "...",
      "category": "Technical"
    }
  ]
}`;

    for (const modelName of models) {
      try {
        const model = this.geminiClient.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        });

        const result = await timeoutPromise(
          model.generateContent([
            prompt,
            {
              inlineData: {
                data: fileBase64,
                mimeType: mimeType,
              },
            },
          ]),
          8000,
          `Gemini vision model ${modelName} timed out after 8s`
        );

        const text = result.response.text();
        const cleaned = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (err: any) {
        console.warn(`[Gemini Vision] ${modelName} failed: ${err.message}`);
      }
    }

    throw new Error('Could not parse document image with Gemini vision.');
  }
}

export const aiProvider = new AIProviderService();
