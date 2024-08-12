import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ClientSentEvents,
  ClientToServerEvents,
  ServerSentEvents,
  ServerToClientEvents,
} from '../socket/events';
import { GamesService } from './games.service';
import { UseGuards } from '@nestjs/common';
import { IsSocketLoggedInGuard } from '../guards/is-socket-logged-in/is-socket-logged-in.guard';
import { MoveDto } from './dto/move.dto';
import { Request } from 'express';
import { ExceptionObject } from '../socket/exceptionObject';
import { ExceptionSource } from '../socket/exceptionSource';
import { GameUpdateDto } from './dto/gameUpdate.dto';

@WebSocketGateway({ namespace: 'socket' })
export class GamesGateway {
  @WebSocketServer() server: Server = new Server<
    ClientToServerEvents,
    ServerToClientEvents
  >();

  constructor(private readonly gameService: GamesService) {}

  @UseGuards(IsSocketLoggedInGuard)
  @SubscribeMessage(ClientSentEvents.makeMove)
  async handleMakeMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MoveDto,
  ) {
    const request = client.request as Request;
    const session = request.session;

    const activeGame = await this.gameService.getActiveGame(session.user);
    if (!activeGame || activeGame.isFinished) {
      throw new WsException(
        new ExceptionObject(
          ExceptionSource.game,
          'Invalid game or game already finished',
        ),
      );
    }
    const game = await this.gameService.makeAMove(
      activeGame,
      session.user.id,
      data.position,
    );
    if (game instanceof ExceptionObject) {
      throw new WsException(game);
    }

    this.server
      .to(game.id.toString())
      .emit(ServerSentEvents.moveMade, GameUpdateDto.from(game, data.position));
  }
}
