import {
  Body,
  Controller,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { ApiTags } from '@nestjs/swagger';
import { SessionData } from 'express-session';
import { PlayerDto } from '../../dto/player.dto';
import { PositionDto } from '../../dto/position.dto';
import { IsLoggedInGuard } from '../../../guards/is-logged-in/is-logged-in.guard';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(IsLoggedInGuard)
  @Post()
  async startGame(@Session() session: SessionData, @Body() players: PlayerDto) {
    const game = await this.gameService.createGame(
      players.player1,
      players.player2,
    );
    session.activeGameId = game.id;
    return game;
  }

  @UseGuards(IsLoggedInGuard)
  @Put()
  async makeMove(
    @Session() session: SessionData,
    @Body() moveData: PositionDto,
  ) {
    return this.gameService.makeAMove(
      session.activeGameId,
      session.user.id,
      moveData.position,
    );
  }
}
