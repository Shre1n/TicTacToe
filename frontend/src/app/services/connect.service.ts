import { Injectable } from '@angular/core';
import {SocketService} from "./socket.service";
import {TictactoeService} from "../tic-tac-toe/services/tictactoe.service";
import {GameDto} from "../Admin/admin-dashboard/interfaces/Game/gamesDto";
import {Router} from "@angular/router";
import {GameUpdateDto} from "./user/interfaces/GameUpdateDto";
import {MatchMakingService} from "../Site-View/match-making/services/match-making.service";
import {ChatDTO} from "../Site-View/chat/dto/chat.dto";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ConnectService {

  private apiUrl = "http://localhost:3000/api";

  messages: ChatDTO[] = [];

  constructor(
    private http: HttpClient,
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
    this.socketService.on('receiveMessage', (message: ChatDTO) => this.receiveMessage(message));

    this.socketService.connect();
  }

  getMessages(gameId: number) {
    this.http.get<ChatDTO[]>(`${this.apiUrl}/chat/messages/${gameId}`).subscribe({
      next: (messages: ChatDTO[]) => {
        this.messages = messages;
      },
      error: (err) => {
        console.error('Failed to fetch messages:', err);
      }
    })
  }

  sendMessage(gameId: number, text: string) {
    this.socketService.emit('sendMessage', { gameId, message: text });
  }

  exception(ex: String){
    console.log(ex);
  }

  receiveMessage(message: ChatDTO) {
    console.log('Message received:', message);
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
