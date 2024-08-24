import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  private messages = new Map<string, ChatDto[]>();

  async getMessagesForGame(gameId: number): Promise<ChatDto[]> {
    return this.messages.get(gameId.toString()) || [];
  }

  async saveMessage(gameId: number, message: ChatDto) {
    if (!this.messages.has(gameId.toString())) {
      this.messages.set(gameId.toString(), []);
    }
    this.messages.get(gameId.toString()).push(message);
  }
}
