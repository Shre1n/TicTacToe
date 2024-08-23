import { Injectable } from '@angular/core';
import {SocketService} from "./socket.service";
import {TictactoeService} from "../tic-tac-toe/services/tictactoe.service";
import {GameDto} from "../Admin/admin-dashboard/interfaces/Game/gamesDto";
import {Router} from "@angular/router";
import {GameUpdateDto} from "./user/interfaces/GameUpdateDto";
import {MatchMakingService} from "../Site-View/match-making/services/match-making.service";

@Injectable()
export class ConnectService {

  constructor(
    private socketService: SocketService,
    private tictactoeService: TictactoeService,
    private router: Router,
    private matchmakingService: MatchMakingService
    ) {
    this.connect();
  }


  connect(){
    this.socketService.on('gameFound', () => this.gameFound());
    this.socketService.on('gameStarted', (game: GameDto) => this.gameStarted(game));
    this.socketService.on('moveMade', (update: GameUpdateDto) => this.moveMade(update));
    this.socketService.on('exception', (ex: String) => this.exception(ex));

    this.socketService.connect();
  }

  exception(ex: String){
    console.log(ex);
  }

  enterQueue(){
    this.socketService.emit('enterQueue');
  }

  moveMade(update: GameUpdateDto){
    this.tictactoeService.moveMade(update);
  }


  gameFound(){
    this.socketService.emit('gameFoundAcknowledged');
  }

  gameStarted(game: GameDto){
    this.tictactoeService.initGameBoard(game);
    this.matchmakingService.changeFoundStatus();
  }


}
