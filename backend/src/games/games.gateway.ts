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
import { SpectateDto } from './dto/spectate.dto';
import { IsSocketAdminGuard } from '../guards/is-socket-admin/is-socket-admin.guard';

@UseFilters(HttpExceptionTransformationFilter)
@WebSocketGateway({ namespace: 'socket' })
export class GamesGateway {
  @WebSocketServer() server: Server = new Server<
    ClientToServerEvents,
    ServerToClientEvents
  >();

  constructor(private readonly gameService: GamesService) {}

  @UseGuards(IsSocketAdminGuard)
  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ClientSentEvents.enterSpectate)
  async handleEnterSpectate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SpectateDto,
  ) {
    const user = await this.gameService.findOne(data.username);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const activeGame = await this.gameService.getActiveGame(user);
    if (!activeGame) {
      throw new NotFoundException('User is not in a game');
    }
    client.join(activeGame.id.toString());
  }

  @UseGuards(IsSocketAdminGuard)
  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ClientSentEvents.leaveSpectate)
  async handleLeaveSpectate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SpectateDto,
  ) {
    const user = await this.gameService.findOne(data.username);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const activeGame = await this.gameService.getActiveGame(user);
    if (!activeGame) {
      throw new NotFoundException('User is not in a game');
    }
    client.leave(activeGame.id.toString());
  }

  @UseGuards(IsSocketLoggedInGuard)
  @UsePipes(new ValidationPipe())
  @SubscribeMessage(ClientSentEvents.makeMove)
  async handleMakeMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MoveDto,
  ) {
    const request = client.request as Request;
    const session = request.session;

    const activeGame = await this.gameService.getActiveGame(session.user);
    if (!activeGame) {
      throw new NotFoundException('User is not in a game');
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
      this.server.to('admin').emit(ServerSentEvents.runningGamesUpdated);
    }
  }

  @UseGuards(IsSocketLoggedInGuard)
  @SubscribeMessage(ClientSentEvents.sendGiveUp)
  async handleGiveUp(@ConnectedSocket() client: Socket) {
    const request = client.request as Request;
    const session = request.session;

    const activeGame = await this.gameService.getActiveGame(session.user);

    if (!activeGame) {
      throw new NotFoundException('Invalid game or game already finished');
    }
    const game = await this.gameService.giveUp(activeGame, session.user.id);
    client.broadcast
      .to(game.id.toString())
      .emit(ServerSentEvents.receiveGiveUp);

    if (game.isFinished) {
      setTimeout(() => this.server.socketsLeave(game.id.toString()), 600000);
      this.server.to('admin').emit(ServerSentEvents.runningGamesUpdated);
    }
  }
}
