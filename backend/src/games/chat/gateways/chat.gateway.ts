import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { IsSocketLoggedInGuard } from '../../../guards/is-socket-logged-in/is-socket-logged-in.guard';
import {
  ClientSentEvents,
  ClientToServerEvents,
  ServerSentEvents,
  ServerToClientEvents,
} from '../../../socket/events';
import { Server, Socket } from 'socket.io';
import { ChatDto } from '../dto/chat.dto';
import { Request } from 'express';
import { GamesService } from '../../games.service';
import { ChatService } from '../chat.service';

@WebSocketGateway({ namespace: 'socket' })
export class ChatGateway {
  @WebSocketServer() server: Server = new Server<
    ClientToServerEvents,
    ServerToClientEvents
  >();

  constructor(
    private readonly gameService: GamesService,
    private readonly chatService: ChatService,
  ) {}

  @UseGuards(IsSocketLoggedInGuard)
  @SubscribeMessage(ClientSentEvents.sendMessage)
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: ChatDto,
  ) {
    const request = client.request as Request;
    const session = request.session;

    const user = session.user;

    if (!user) {
      throw new WsException('User not found');
    }

    await this.chatService.saveMessage(user, message);

    const game = await this.gameService.getActiveGame(session.user);
    if (!game)
      throw new WsException(
        'Invalid game room or User is not part of this game',
      );

    this.server.to(game.id.toString()).emit(ServerSentEvents.receiveMessage, {
      username: message.username,
      message: message.message,
    });
  }
}
