import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { SupportedLanguage } from '@bhumitra/types';

export interface PromptContext {
  language: SupportedLanguage;
  intent: string;
  data: Record<string, unknown>;
  history?: Array<{ role: string; content: string }>;
}

@Injectable()
export class AiProviderService {
  private readonly logger = new Logger(AiProviderService.name);
  private readonly geminiApiKey?: string;

  constructor(private readonly config: ConfigService) {
    this.geminiApiKey = this.config.get<string>('GEMINI_API_KEY');
  }

  /**
   * Detect language from text (Devanagari script, regional scripts, Hinglish patterns)
   */
  detectLanguage(text: string): SupportedLanguage {
    if (!text) return 'en';

    // Check script ranges
    if (/[\u0900-\u097F]/.test(text)) {
      // Devanagari script: could be Hindi or Marathi.
      if (/\b(आहे|झाले|कधी|नाही|काय)\b/i.test(text)) return 'mr';
      return 'hi';
    }
    if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu'; // Gujarati
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'; // Kannada
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'; // Malayalam
    if (/[\u0A00-\u0A7F]/.test(text)) return 'pa'; // Punjabi

    // Latin script Hinglish heuristics
    const hinglishWords = [
      'zamin', 'zameen', 'kisan', 'muavja', 'muawza', 'kab', 'milega',
      'kya', 'kaise', 'hoga', 'mera', 'meri', 'khatedar', 'patwari',
      'tehsil', 'paisa', 'kitna', 'adhigrahan', 'batao'
    ];
    const lower = text.toLowerCase();
    const matchCount = hinglishWords.filter((w) => lower.includes(w)).length;
    if (matchCount >= 2) return 'hinglish';

    return 'en';
  }

  /**
   * Optional Cloud LLM reasoning hook (Gemini / OpenAI)
   * Falls back seamlessly to structured deterministic synthesis if unconfigured or offline
   */
  async enhanceWithLlm(
    userMessage: string,
    context: PromptContext,
  ): Promise<string | null> {
    // If Gemini API Key configured:
    if (this.geminiApiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are Bhu-Mitra AI, the national land acquisition decision-support assistant for Government of India (DoLR/MoRD).
Ground your answer ONLY in this factual Bhu-Mitra application data: ${JSON.stringify(context.data)}.
Respond in language: ${context.language}.
Do not invent unverified numbers or projects.
User Query: "${userMessage}"`,
                  },
                ],
              },
            ],
          }),
        });

        if (res.ok) {
          const json = (await res.json()) as any;
          const candidate = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate) return candidate;
        }
      } catch (err) {
        this.logger.warn(`Gemini API call failed: ${(err as Error).message}. Using deterministic fallback.`);
      }
    }

    // Return null to allow structured deterministic synthesis
    return null;
  }
}
