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

  private readonly max_games: number = 20;

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

    const activeGames = await this.gameService.getActiveGamesByPlayer(
      session.user,
    );
    if (activeGames?.length > 0) {
      activeGames.forEach((game) => client.join(game.id.toString()));
    }
  }

  @UseGuards(IsSocketLoggedInGuard)
  @SubscribeMessage(ClientSentEvents.enterQueue)
  async handleEnter(@ConnectedSocket() client: Socket) {
    const request = client.request as Request;
    const session = request.session;

    // Check if the player can enter the queue
    if (this.queueService.isPlayerInQueue(session.user))
      throw new WsException('Player already in queue.');

    const userGames = await this.gameService.getActiveGamesByPlayer(
      session.user,
    );
    if (userGames.length > this.max_games)
      throw new WsException('Too many games.');
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
        'One of the players is already waiting for acknowledgement.',
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
      throw new WsException('Player not waiting for acknowledgement.');

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

      this.server.to(preGame.player1Id).emit(ServerSentEvents.gameStarted, {
        opponent: UserDto.from(game.player2),
        gameId: game.id,
      });
      this.server.to(preGame.player2Id).emit(ServerSentEvents.gameStarted, {
        opponent: UserDto.from(game.player1),
        gameId: game.id,
      });
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
