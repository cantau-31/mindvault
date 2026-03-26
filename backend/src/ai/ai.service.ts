import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.LITELLM_API_KEY || 'sk-placeholder',
      // baseURL pointe vers le proxy LiteLLM, PAS vers OpenAI directement
      baseURL: process.env.LITELLM_BASE_URL || 'http://localhost:4000',
    });
  }

  async summarize(text: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Résume ce texte en 2 phrases concises en français.' },
        { role: 'user', content: text },
      ],
      max_tokens: 200,
    });
    return response.choices[0].message.content || '';
  }

  async suggestBooks(query: string, catalog: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Tu es un bibliothécaire expert. Voici le catalogue disponible :\n${catalog}\nRecommande des livres en fonction de la demande de l'utilisateur. Réponds en français.`,
        },
        { role: 'user', content: query },
      ],
      max_tokens: 300,
    });
    return response.choices[0].message.content || '';
  }
}
