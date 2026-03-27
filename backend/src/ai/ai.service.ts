import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: OpenAI | null;
  private readonly model: string;

  constructor() {
    const apiKey =
      process.env.LITELLM_API_KEY || process.env.OPENAI_API_KEY || '';
    const baseURL = process.env.LITELLM_BASE_URL || process.env.OPENAI_BASE_URL;
    this.model = process.env.LITELLM_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      this.client = null;
      this.logger.warn(
        'No AI API key configured (LITELLM_API_KEY / OPENAI_API_KEY). Fallback mode enabled.',
      );
      return;
    }

    this.client = new OpenAI({
      apiKey,
      // baseURL pointe vers le proxy LiteLLM, PAS vers OpenAI directement
      baseURL,
    });
  }

  async summarize(text: string): Promise<string> {
    const source = text.trim();
    if (!source) {
      return '';
    }

    if (!this.client) {
      return this.buildFallbackSummary(source);
    }

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'Résume ce texte en 2 phrases concises en français.' },
          { role: 'user', content: source },
        ],
        max_tokens: 200,
      });
      return response.choices[0].message.content?.trim() || this.buildFallbackSummary(source);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`AI summarize failed, using fallback summary: ${message}`);
      return this.buildFallbackSummary(source);
    }
  }

  async suggestBooks(query: string, catalog: string): Promise<string> {
    if (!this.client) {
      return "Service IA indisponible pour le moment. Réessaie plus tard.";
    }

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `Tu es un bibliothécaire expert. Voici le catalogue disponible :\n${catalog}\nRecommande des livres en fonction de la demande de l'utilisateur. Réponds en français.`,
          },
          { role: 'user', content: query },
        ],
        max_tokens: 300,
      });
      return response.choices[0].message.content?.trim() || '';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`AI suggestBooks failed: ${message}`);
      return "Service IA indisponible pour le moment. Réessaie plus tard.";
    }
  }

  private buildFallbackSummary(text: string): string {
    const compactText = text.replace(/\s+/g, ' ').trim();
    const sentences = compactText
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);

    if (sentences.length >= 2) {
      return `${sentences[0]} ${sentences[1]}`;
    }

    if (sentences.length === 1) {
      const words = sentences[0].split(' ');
      if (words.length <= 35) {
        return sentences[0];
      }
      return `${words.slice(0, 35).join(' ')}...`;
    }

    const words = compactText.split(' ');
    return `${words.slice(0, 35).join(' ')}...`;
  }
}
