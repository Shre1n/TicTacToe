import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { Game } from '../games.entity';

@Injectable()
export class ChatService {
  private messages = new Map<string, ChatDto[]>();

  async getMessagesByGame(game: Game): Promise<ChatDto[]> {
    return this.messages.get(game.id.toString()) || [];
  }

  async saveMessage(game: Game, message: ChatDto) {
    if (!this.messages.has(game.id.toString())) {
      this.messages.set(game.id.toString(), []);
    }
    this.messages.get(game.id.toString()).push(message);
  }
}
