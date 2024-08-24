import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages/:gameId')
  async getMessages(@Param('gameId') gameId: number): Promise<ChatDto[]> {
    return this.chatService.getMessagesForGame(gameId);
  }

  @Post('messages')
  async sendMessage(@Body() chatDto: ChatDto) {
    return this.chatService.saveMessage(chatDto.gameId, chatDto);
  }
}
