import { Controller } from '@nestjs/common';
import { GamesService } from './games.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('game')
@Controller('game')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}


}
