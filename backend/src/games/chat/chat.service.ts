import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { GamesService } from '../games.service';
import { User } from '../../users/users.entity';

@Injectable()
export class ChatService {
  private messages = new Map<string, ChatDto[]>();

  constructor(private readonly gameService: GamesService) {}

  async getMessagesForGame(user: User): Promise<ChatDto[]> {
    const game = await this.gameService.getActiveGame(user);
    if (!game) throw new NotFoundException('No active game');
    return this.messages.get(game.id.toString()) || [];
  }

  async saveMessage(user: User, message: ChatDto) {
    const game = await this.gameService.getActiveGame(user);
    if (!game) throw new NotFoundException('No active game');
    if (!this.messages.has(game.id.toString())) {
      this.messages.set(game.id.toString(), []);
    }
    this.messages.get(game.id.toString()).push(message);
  }
}
