import { Controller, Get, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles/roles.guard';
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
  @ApiOkResponse({ description: 'List of all games', type: [GameDto] })
  async getAllActiveGames(): Promise<GameDto[]> {
    return await this.gameService.getActiveGames();
  }
}
