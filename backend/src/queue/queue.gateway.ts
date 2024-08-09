import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly queueService: QueueService,
    private readonly gameService: GameService,
  ) {}

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const request = client.request as Request;
    const session = request.session;

    if (session.isLoggedIn) {
      client.leave(session.id);
    }
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const request = client.request as Request;
    const session = request.session;
    if (session.isLoggedIn !== true) client.disconnect();
    else client.join(session.id);

    const activeGame = await this.gameService.getActiveGame(session.user);
    if (activeGame) {
      client.join(activeGame.id.toString());
    }
  }

  @UseGuards(IsSocketLoggedInGuard)
  @SubscribeMessage(ClientSentEvents.enterQueue)
  async handleEnter(@ConnectedSocket() client: Socket) {
    const request = client.request as Request;
    const session = request.session;

    // Check if the player can enter the queue
    if (this.queueService.isPlayerInQueue(session.user))
      throw new WsException(
        new ExceptionObject(ExceptionSource.queue, 'Player already in queue.'),
      );
    if (await this.gameService.isPlayerInGame(session.user))
      throw new WsException(
        new ExceptionObject(ExceptionSource.queue, 'Player already in game.'),
      );

    // Try to find an opponent; Add the player to queue and return if none is found
    const opponent = await this.queueService.findOpponent(session.user);
    if (!opponent) {
      this.queueService.addPlayer(session.user, session.id);
      return;
    }

    // Prepare a game and wait for both player to acknowledge the match
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

    // Check if the player still has a game waiting for acknowledgement
    if (!this.queueService.isWaitingForAcknowledgement(session.user))
      throw new WsException(
        new ExceptionObject(
          ExceptionSource.queue,
          'Player not waiting for acknowledgement.',
        ),
      );

    // Acknowledge the game and start it, when it's fully acknowledged
    this.queueService.acknowledgePreGame(session.user);
    if (this.queueService.isPreGameAcknowledged(session.user)) {
      const preGame = this.queueService.removePreGame(session.user);
      const game = await this.gameService.createGame(
        preGame.player1.id,
        preGame.player2.id,
      );
      this.server
        .in([preGame.player1Id, preGame.player2Id])
        .socketsJoin(game.id.toString());
      this.server.to(game.id.toString()).emit(ServerSentEvents.gameStarted);
    }
  }

  @UseGuards(IsSocketLoggedInGuard)
  @SubscribeMessage(ClientSentEvents.leaveQueue)
  async leaveHandler(@ConnectedSocket() client: Socket) {
    const request = client.request as Request;
    const session = request.session;

    this.queueService.removePlayer(session.user);
  }
}
