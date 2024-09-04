import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
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
import { IsLoggedInGuard } from '../guards/is-logged-in/is-logged-in.guard';
import { Game } from './games.entity';
import { RolesGuard } from '../guards/roles/roles.guard';
import { SessionData } from 'express-session';
import { GameDto } from './dto/game.dto';

@ApiTags('game')
@Controller('game')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all running games',
    description: 'Returns all games that are currently played.',
  })
  @ApiOkResponse({ description: 'List of all games', type: [Game] })
  async getAllActiveGames(): Promise<Game[]> {
    return await this.gameService.getActiveGames();
  }

  @UseGuards(IsLoggedInGuard)
  @ApiOperation({
    summary: 'Get a specific game by id',
    description:
      'Returns the game with fitting id. The game must be a game played by the logged in user.',
  })
  @Get(':id')
  @ApiNotFoundResponse({ description: 'The requested game does not exist' })
  @ApiOkResponse({ description: 'Successful operation', type: [GameDto] })
  async getGameById(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: SessionData,
  ): Promise<GameDto> {
    const game = await this.gameService.getGameById(id);

    if (!game || this.gameService.getPlayerIdentity(game, session.user) === 0)
      throw new NotFoundException('Invalid game id');

    return await this.gameService.gameToFullDto(game, session.user);
  }
}
