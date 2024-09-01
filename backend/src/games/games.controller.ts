import { Controller, Get, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsLoggedInGuard } from '../guards/is-logged-in/is-logged-in.guard';
import { Game } from './games.entity';

@ApiTags('game')
@Controller('game')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @UseGuards(IsLoggedInGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all running games',
    description: 'Returns all games that are currently played.',
  })
  @ApiOkResponse({ description: 'List of all games', type: [Game] })
  async getAllGames(): Promise<Game[]> {
    return await this.gameService.getAllGames();
  }
}
