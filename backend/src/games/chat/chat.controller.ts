import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';
import { IsLoggedInGuard } from '../../guards/is-logged-in/is-logged-in.guard';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(IsLoggedInGuard)
  @Get('messages/:gameId')
  @ApiOkResponse({ description: 'Successful operation', type: [ChatDto] })
  async getMessages(@Param('gameId') gameId: number): Promise<ChatDto[]> {
    return this.chatService.getMessagesForGame(gameId);
  }

  @UseGuards(IsLoggedInGuard)
  @Post('messages')
  @ApiOkResponse({ description: 'Successful operation', type: ChatDto })
  async sendMessage(@Body() chatDto: ChatDto) {
    return this.chatService.saveMessage(chatDto.gameId, chatDto);
  }
}
