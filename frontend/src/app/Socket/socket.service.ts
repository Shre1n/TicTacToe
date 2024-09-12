import { Injectable } from '@angular/core';

import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { GameUpdateDto } from '../Game/interfaces/GameUpdateDto';
import { ChatDTO } from '../Game/chat/dto/chat.dto';
import { MoveDto } from '../Game/interfaces/MoveDto';
import { UserDto } from '../User/interfaces/userDto';
import { ToastService } from '../Notifications/toast-menu/services/toast.service';

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

  constructor(toastService: ToastService) {
    super(config);
    this.on("gameFound", () => this.emit("gameFoundAcknowledged"));
    this.on("exception", (err: any) => {
      toastService.show('error', "Socket Error!", err.message);
      console.error(err);
    });
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

  giveUp (){
    this.emit("sendGiveUp");
  }

  sendMessage(message: ChatDTO) {
    this.emit("sendMessage", message);
  }

  enterSpectate(username: string) {
    this.emit("enterSpectate", {username});
  }

  leaveSpectate(username: string) {
    this.emit("leaveSpectate", {username});
  }

  onGameStarted() {
    return this.fromEvent<UserDto>("gameStarted");
  }

  onMoveMade() {
    return this.fromEvent<GameUpdateDto>("moveMade");
  }

  onGiveup (){
    return this.fromEvent("receiveGiveUp");
  }

  onReceiveMessage() {
    return this.fromEvent<ChatDTO>("receiveMessage");
  }

  onQueueUpdated() {
    return this.fromEvent("queueUpdated");
  }

  onRunningGamesUpdated() {
    return this.fromEvent("runningGamesUpdated");
  }


}
