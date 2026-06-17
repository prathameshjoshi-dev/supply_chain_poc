import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiHistory } from './schemas/ai-history.schema';

@Injectable()
export class AiService {
  private readonly ollamaUrl = 'http://localhost:11434/api/generate';
  private readonly modelName = 'qwen3:4b';

  constructor(
    @InjectModel(AiHistory.name) private aiHistoryModel: Model<AiHistory>
  ) {}

  async sendMessage(userId: string, prompt: string): Promise<string> {
    try {
      const response = await fetch(this.ollamaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelName,
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama returned status: ${response.status}`);
      }

      const data = await response.json();
      
      // Save to history
      await this.aiHistoryModel.create({
        userId,
        prompt,
        response: data.response,
      });

      return data.response;
    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw new InternalServerErrorException('Failed to generate response from AI Assistant.');
    }
  }

  async getHistory(userId: string): Promise<AiHistory[]> {
    return this.aiHistoryModel.find({ userId }).sort({ createdAt: 1 }).exec();
  }
}
