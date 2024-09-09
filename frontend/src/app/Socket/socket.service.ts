import { Injectable } from '@angular/core';

import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { GameUpdateDto } from '../Game/interfaces/GameUpdateDto';
import { ChatDTO } from '../Game/chat/dto/chat.dto';
import { MoveDto } from '../Game/interfaces/MoveDto';
import { MatchUpDto } from '../Game/interfaces/MatchUpDto';

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
    this.on("exception", (err: String) => console.log(err));
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

  giveUp (id: number){
    this.emit("sendGiveUp", id);
  }

  sendMessage(message: ChatDTO) {
    this.emit("sendMessage", message);
  }

  onGameStarted() {
    return this.fromEvent<MatchUpDto>("gameStarted");
  }

  onMoveMade() {
    return this.fromEvent<GameUpdateDto>("moveMade");
  }

  onGiveup (){
    return this.fromEvent<number>("receiveGiveUp");
  }

  onReceiveMessage() {
    return this.fromEvent<ChatDTO>("receiveMessage");
  }
}
