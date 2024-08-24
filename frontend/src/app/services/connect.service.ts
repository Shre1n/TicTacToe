import { Injectable } from '@angular/core';
import {SocketService} from "./socket.service";
import {TictactoeService} from "../tic-tac-toe/services/tictactoe.service";
import {GameDto} from "../Admin/admin-dashboard/interfaces/Game/gamesDto";
import {Router} from "@angular/router";
import {GameUpdateDto} from "./user/interfaces/GameUpdateDto";
import {MatchMakingService} from "../Site-View/match-making/services/match-making.service";
import {ChatDTO} from "../Site-View/chat/dto/chat.dto";
import {HttpClient} from "@angular/common/http";
import {ReadUserService} from "./user/readUser/read-user.service";

@Injectable()
export class ConnectService {

  private apiUrl = "http://localhost:3000/api";

  messages: ChatDTO[] = [];

  id: number = 0;

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
    private tictactoeService: TictactoeService,
    private router: Router,
    private matchmakingService: MatchMakingService,
    private readUser: ReadUserService
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

  getMessages() {
    const id = window.localStorage.getItem("gameId");
    if (!id) {
      console.error('No gameId found in localStorage');
      return;
    }
    this.http.get<ChatDTO[]>(`${this.apiUrl}/chat/messages/${id}`).subscribe({
      next: (messages: ChatDTO[]) => {
        this.messages = messages;
        console.log('Messages fetched successfully:', messages, id);
      },
      error: (err) => {
        console.error('Failed to fetch messages:', err);
      }
    })
  }

  sendMessage(gameId: number, message: string) {

    this.socketService.emit('sendMessage', { gameId, message });
    this.id = gameId;
    const username = this.readUser.username;
    const body = {gameId, username, message};

    this.http.post<ChatDTO>(`${this.apiUrl}/chat/messages`, body).subscribe({
      next: (messages: ChatDTO) => {
        this.messages.push(messages);
        console.log('Messages send successfully:', this.messages);
      },
      error: (err) => {
        console.error(err);
      }
    });
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
    this.id = game.gameId;
    this.tictactoeService.initGameBoard(game);
    this.matchmakingService.changeFoundStatus();
  }

  leaveQueue(){
    this.socketService.emit('leaveQueue');
  }


}
