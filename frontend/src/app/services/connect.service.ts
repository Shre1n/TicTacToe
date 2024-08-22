import { Injectable } from '@angular/core';
import {SocketService} from "./socket.service";

@Injectable()
export class ConnectService {

  constructor(private socketService: SocketService) {
    this.connect();
  }


  connect(){
    this.socketService.on('gameFound', () => this.gameFound());
    this.socketService.on('gameStarted', () => this.gameStarted());
    this.socketService.on('moveMade', () => this.moveMade());

    this.socketService.connect();
  }

  enterQueue(){
    this.socketService.emit('enterQueue');
  }


  gameFound(){
    this.socketService.emit('gameFoundAcknowledged')
  }

  gameStarted(){
    //navigate to sites
    this.socketService.emit('')
  }

  moveMade(){

    this.socketService.emit('')
  }

  gameOver(){
    this.socketService.emit('')
  }

  gameStateSent(){
    this.socketService.emit('')
  }

}
