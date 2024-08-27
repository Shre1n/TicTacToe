import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';
import { IsLoggedInGuard } from '../../guards/is-logged-in/is-logged-in.guard';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SessionData } from 'express-session';

@ApiTags('game')
@Controller('game/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(IsLoggedInGuard)
  @Get()
  @ApiOkResponse({ description: 'Successful operation', type: [ChatDto] })
  @ApiNotFoundResponse({ description: 'User has no active game' })
  async getMessages(@Session() session: SessionData): Promise<ChatDto[]> {
    return this.chatService.getMessagesForGame(session.user);
  }

  @UseGuards(IsLoggedInGuard)
  @Post()
  @ApiOkResponse({ description: 'Successful operation', type: ChatDto })
  @ApiNotFoundResponse({ description: 'User has no active game' })
  async sendMessage(@Session() session: SessionData, @Body() chatDto: ChatDto) {
    return this.chatService.saveMessage(session.user, chatDto);
  }
}
