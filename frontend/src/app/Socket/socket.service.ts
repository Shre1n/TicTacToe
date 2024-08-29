import { Injectable } from '@angular/core';

import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { GameDto } from '../Game/interfaces/gamesDto';
import { GameUpdateDto } from '../Game/interfaces/GameUpdateDto';
import { ChatDTO } from '../Game/chat/dto/chat.dto';
import { MoveDto } from '../Game/interfaces/MoveDto';

const config: SocketIoConfig = {
  url: 'http://localhost:3000/socket',
  options: {
    autoConnect: false
  }
};

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket{

  constructor() {
    super(config);
    this.on("gameFound", () => this.emit("gameFoundAcknowledged"));
  }

  enterQueue() {
    this.emit("enterQueue");
  }

  leaveQueue() {
    this.emit("leaveQueue");
  }

  makeMove(move: MoveDto) {
    this.emit("makeMove", move);
  }

  sendMessage(message: ChatDTO) {
    this.emit("sendMessage", message);
  }

  onGameStarted() {
    return this.fromEvent<GameDto>("gameStarted");
  }

  onMoveMade() {
    return this.fromEvent<GameUpdateDto>("moveMade");
  }

  onReceiveMessage() {
    return this.fromEvent<ChatDTO>("receiveMessage");
  }
}
