import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  private messages = new Map<number, ChatDto[]>();

  async getMessagesForGame(gameId: number): Promise<ChatDto[]> {
    console.log('Current messages keys:', Array.from(this.messages.keys()));
    console.log('Messages for gameId:', gameId, this.messages.get(0));
    return this.messages.get(0) || [];
  }

  async saveMessage(gameId: number, message: ChatDto) {
    if (!this.messages.has(gameId)) {
      this.messages.set(gameId, []);
    }
    this.messages.get(gameId).push(message);
    console.log(`Message added to game ${gameId}:`, message);
    console.log('Current messages:', this.messages.get(gameId));
  }
}
