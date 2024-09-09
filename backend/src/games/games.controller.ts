import { Controller, Get, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Game } from './games.entity';
import { RolesGuard } from '../guards/roles/roles.guard';

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
}
