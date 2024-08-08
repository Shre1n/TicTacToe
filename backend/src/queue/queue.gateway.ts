import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { IsSocketLoggedInGuard } from '../guards/is-socket-logged-in/is-socket-logged-in.guard';
import { QueueService } from './queue.service';
import { Server, Socket } from 'socket.io';
import { Request } from 'express';
import { ClientSentEvents, ServerSentEvents } from '../socket/events';
import { ExceptionObject } from '../socket/exceptionObject';
import { ExceptionSource } from '../socket/exceptionSource';
import { GameService } from '../games/logic/game/game.service';
import { PreGameObject } from './preGameObject';

@WebSocketGateway({ namespace: 'socket' })
export class QueueGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(
    private readonly queueService: QueueService,
    private readonly gameService: GameService,
  ) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    const request = client.request as Request;
    const session = request.session;
    if (session.isLoggedIn !== true) client.disconnect();
    else client.join(session.id);
  }

  @UseGuards(IsSocketLoggedInGuard)
  @SubscribeMessage(ClientSentEvents.enterQueue)
  async handleEnter(@ConnectedSocket() client: Socket) {
    const request = client.request as Request;
    const session = request.session;
    console.log(session.id);
    if (this.queueService.isPlayerInQueue(session.user))
      throw new WsException(
        new ExceptionObject(ExceptionSource.queue, 'Player already in queue.'),
      );
    if (await this.queueService.isPlayerInGame(session.activeGameId))
      throw new WsException(
        new ExceptionObject(ExceptionSource.queue, 'Player already in game.'),
      );

    const opponent = await this.queueService.findOpponent(session.user);
    if (!opponent) {
      this.queueService.addPlayer(session.user, session.id);
      return;
    }
    this.queueService.removePlayer(opponent.player);

    const preGame = new PreGameObject(
      session.user,
      opponent.player,
      session.id,
      opponent.sessionId,
    );

    if (!this.queueService.prepareGame(preGame))
      throw new WsException(
        new ExceptionObject(
          ExceptionSource.queue,
          'One of the players is already waiting for acknowledgement.',
        ),
      );

    this.server.to(session.id).emit(ServerSentEvents.gameFound);
    this.server.to(opponent.sessionId).emit(ServerSentEvents.gameFound);
  }

  @UseGuards(IsSocketLoggedInGuard)
  @SubscribeMessage(ClientSentEvents.gameFoundAcknowledged)
  async acknowledgeHandler(@ConnectedSocket() client: Socket) {
    const request = client.request as Request;
    const session = request.session;
    if (!this.queueService.isWaitingForAcknowledgement(session.user))
      throw new WsException(
        new ExceptionObject(
          ExceptionSource.queue,
          'Player not waiting for acknowledgement.',
        ),
      );

    this.queueService.acknowledgePreGame(session.user);

    if (this.queueService.isPreGameAcknowledged(session.user)) {
      const preGame = this.queueService.removePreGame(session.user);
      const game = await this.gameService.createGame(
        preGame.player1.id,
        preGame.player2.id,
      );
      session.activeGameId = game.id;
      this.server
        .in([preGame.player1Id, preGame.player2Id])
        .socketsJoin(game.id.toString());
      this.server.to(game.id.toString()).emit(ServerSentEvents.gameStarted);
    }
  }
}
