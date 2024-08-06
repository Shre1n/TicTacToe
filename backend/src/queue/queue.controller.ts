import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SessionData } from 'express-session';
import { QueueService } from './queue.service';
import { GameService } from '../games/logic/game/game.service';
import { RolesGuard } from '../guards/roles/roles.guard';
import { QueueDto } from './dto/queue.dto';

@ApiTags('matchmaking')
@Controller('queue')
export class QueueController {
  constructor(
    private readonly queueService: QueueService,
    private readonly gameService: GameService,
  ) {}

  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: 'Get the matchmaking queue' })
  @ApiOkResponse({ description: 'successful operation', type: QueueDto })
  async get() {
    return this.queueService.getQueue();
  }

  //@UseGuards(IsLoggedInGuard)
  @Post()
  @ApiOperation({
    summary: 'Moves current player into the matchmaking queue',
  })
  @ApiOkResponse({ description: 'Successful operation' })
  @ApiBadRequestResponse({ description: 'Player is busy' })
  @ApiNotFoundResponse({
    description: 'No opponent found. Player is waiting in queue',
  })
  async enter(@Session() session: SessionData) {
    if (this.queueService.isPlayerInQueue(session))
      throw new BadRequestException('Player already in queue.');
    if (await this.queueService.isPlayerInGame(session))
      throw new BadRequestException('Player already in game.');

    const opponent = await this.queueService.findOpponent(session.user);
    if (!opponent)
      throw new NotFoundException('No opponent found. Waiting in queue');

    // Notify Opponent

    const game = await this.gameService.createGame(
      session.user.id,
      opponent.id,
    );
    session.activeGameId = game.id;
    return game;
  }

  //@UseGuards(IsLoggedInGuard)
  @Delete()
  async leave(@Session() session: SessionData) {}
}
