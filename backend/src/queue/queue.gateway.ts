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
import {
  ClientSentEvents,
  ClientToServerEvents,
  ServerSentEvents,
  ServerToClientEvents,
} from '../socket/events';
import { GamesService } from '../games/games.service';
import { PreGameObject } from './preGameObject';
import { UserDto } from '../users/dto/user.dto';

@WebSocketGateway({ namespace: 'socket' })
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server = new Server<
    ClientToServerEvents,
    ServerToClientEvents
  >();

  constructor(
    private readonly queueService: QueueService,
    private readonly gameService: GamesService,
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

    if (session.isLoggedIn !== true) {
      client.disconnect();
      return;
    }

    client.join(session.id);

    if (session.user.isAdmin) client.join('admin');

    const activeGame = await this.gameService.getActiveGame(session.user);
    if (activeGame) client.join(activeGame.id.toString());
  }

  @UseGuards(IsSocketLoggedInGuard)
  @SubscribeMessage(ClientSentEvents.enterQueue)
  async handleEnter(@ConnectedSocket() client: Socket) {
    const request = client.request as Request;
    const session = request.session;

    // Check if the player can enter the queue
    if (session.isAdmin) throw new WsException("Admins can't start a game");

    if (this.queueService.isPlayerInQueue(session.user))
      throw new WsException('Player already in queue.');

    if (await this.gameService.isPlayerInGame(session.user))
      throw new WsException('Player already in game.');

    // Try to find an opponent; Add the player to queue and return if none is found
    const opponent = await this.queueService.findOpponent(session.user);
    if (!opponent) {
      this.queueService.addPlayer(session.user, session.id);
      this.server.to('admin').emit(ServerSentEvents.queueUpdated);
      return;
    }

    // Prepare a game and wait for both player to acknowledge the match
    const preGame = new PreGameObject(
      session.user,
      opponent.player,
      session.id,
      opponent.sessionId,
    );
    if (!this.queueService.prepareGame(preGame))
      throw new WsException(
        'One of the players is already waiting for acknowledgement.',
      );
    this.queueService.addPlayer(session.user, session.id);

    this.server.to('admin').emit(ServerSentEvents.queueUpdated);
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
      throw new WsException('Player not waiting for acknowledgement.');

    // Acknowledge the game and start it, when it's fully acknowledged
    this.queueService.acknowledgePreGame(session.user);
    if (this.queueService.isPreGameAcknowledged(session.user)) {
      const preGame = this.queueService.removePreGame(session.user);
      this.queueService.removePlayer(preGame.player1);
      this.queueService.removePlayer(preGame.player2);

      const game = await this.gameService.createGame(
        preGame.player1,
        preGame.player2,
      );

      this.server
        .in([preGame.player1Id, preGame.player2Id])
        .socketsJoin(game.id.toString());

      this.server
        .to(preGame.player1Id)
        .emit(ServerSentEvents.gameStarted, UserDto.from(game.player2));
      this.server
        .to(preGame.player2Id)
        .emit(ServerSentEvents.gameStarted, UserDto.from(game.player1));
      this.server.to('admin').emit(ServerSentEvents.runningGamesUpdated);
    }
  }

  @UseGuards(IsSocketLoggedInGuard)
  @SubscribeMessage(ClientSentEvents.leaveQueue)
  async leaveHandler(@ConnectedSocket() client: Socket) {
    const request = client.request as Request;
    const session = request.session;

    this.queueService.removePlayer(session.user);
    this.server.to('admin').emit(ServerSentEvents.queueUpdated);
  }
}
