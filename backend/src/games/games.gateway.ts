import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ClientSentEvents,
  ClientToServerEvents,
  ServerSentEvents,
  ServerToClientEvents,
} from '../socket/events';
import { GamesService } from './games.service';
import {
  NotFoundException,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IsSocketLoggedInGuard } from '../guards/is-socket-logged-in/is-socket-logged-in.guard';
import { MoveDto } from './dto/move.dto';
import { Request } from 'express';
import { GameUpdateDto } from './dto/gameUpdate.dto';
import { HttpExceptionTransformationFilter } from '../filter/HttpExceptionTransformationFilter';

@UseFilters(HttpExceptionTransformationFilter)
@WebSocketGateway({ namespace: 'socket' })
export class GamesGateway {
  @WebSocketServer() server: Server = new Server<
    ClientToServerEvents,
    ServerToClientEvents
  >();

  constructor(private readonly gameService: GamesService) {}

  @UseGuards(IsSocketLoggedInGuard)
  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ClientSentEvents.makeMove)
  async handleMakeMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MoveDto,
  ) {
    const request = client.request as Request;
    const session = request.session;

    const activeGame = await this.gameService.getGameById(data.id);
    if (
      !activeGame ||
      activeGame.isFinished ||
      this.gameService.getPlayerIdentity(activeGame, session.user) === 0
    ) {
      throw new NotFoundException('Invalid game id');
    }

    const game = await this.gameService.makeAMove(
      activeGame,
      session.user.id,
      data.position,
    );

    this.server
      .to(game.id.toString())
      .emit(ServerSentEvents.moveMade, GameUpdateDto.from(game, data.position));

    if (game.isFinished) {
      setTimeout(() => this.server.socketsLeave(game.id.toString()), 600000);
      this.server.to("admin").emit(ServerSentEvents.runningGamesUpdated);
    }
  }
}
