import { Injectable } from '@angular/core';
import {io, Socket} from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class ConnectService {

  constructor(private socket: Socket) {
    this.socket.on('gameFound', () => this.gameFound());
    this.socket.on('gameStarted', () => this.gameStarted());
    this.socket.on('moveMade', () => this.moveMade());
    this.socket.on('gameOver', () => this.gameOver());
    this.socket.on('gameStateSent', () => this.gameStateSent());
  }


  connect(){
    this.socket = io('http://' + window.location.host)
  }

  enterQueue(){
    this.socket.emit('enterQueue')
  }


  gameFound(){
    this.socket.emit('gameFoundAcknowledged')
  }

  gameStarted(){
    //navigate to sites
    this.socket.emit('')
  }

  moveMade(){

    this.socket.emit('')
  }

  gameOver(){
    this.socket.emit('')
  }

  gameStateSent(){
    this.socket.emit('')
  }

}
