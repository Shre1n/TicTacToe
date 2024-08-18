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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GameDto } from './dto/game.dto';
import { SessionData } from 'express-session';
import { IsLoggedInGuard } from '../guards/is-logged-in/is-logged-in.guard';
import { Game } from './games.entity';

@ApiTags('game')
@Controller('game')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @UseGuards(IsLoggedInGuard)
  @Get('active')
  @ApiOperation({
    summary: 'Gets the active game of the current user',
    description:
      'Gets the game, the user is currently playing in. 404 the user has no game, he is playing in. The user has to be logged in',
  })
  @ApiOkResponse({ description: 'Successful operation', type: GameDto })
  @ApiNotFoundResponse({ description: 'The is not playing a game' })
  async getUserInfo(@Session() session: SessionData): Promise<GameDto> {
    const game = await this.gameService.getActiveGame(session.user);
    if (!game) throw new NotFoundException('Player not in a game');
    return GameDto.from(game);
  }

  @UseGuards(IsLoggedInGuard)
  @Get('running')
  @ApiOperation({
    summary: 'Get all games',
    description: 'Returns all games that exist.',
  })
  @ApiOkResponse({ description: 'List of all games', type: [Game] })
  async getAllGames(): Promise<Game[]> {
    return await this.gameService.getAllGames();
  }
}
