import {
  Controller,
  Get,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GameDto } from './dto/game.dto';
import { SessionData } from 'express-session';
import { IsLoggedInGuard } from '../guards/is-logged-in/is-logged-in.guard';
import { Game } from './games.entity';
import { ChatService } from './chat/chat.service';

@ApiTags('game')
@Controller('game')
export class GamesController {
  constructor(
    private readonly gameService: GamesService,
    private readonly chatService: ChatService,
  ) {}

  @UseGuards(IsLoggedInGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all games',
    description: 'Returns all games that exist.',
  })
  @ApiOkResponse({ description: 'List of all games', type: [Game] })
  async getAllGames(): Promise<Game[]> {
    return await this.gameService.getAllGames();
  }
}
