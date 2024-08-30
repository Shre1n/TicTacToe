import { Injectable } from '@angular/core';
import {GameDto} from "../../interfaces/gamesDto";
import {UserDto} from "../../../User/interfaces/userDto";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {SocketService} from "../../../Socket/socket.service";
import {MoveDto} from "../../interfaces/MoveDto";
import {GameUpdateDto} from "../../interfaces/GameUpdateDto";
import {ChatDTO} from "../../chat/dto/chat.dto";
import { UserService } from '../../../User/user.service';

@Injectable({
  providedIn: 'root'
})
export class TictactoeService {


  private apiUrl = 'http://localhost:3000/api';

  public chat: ChatDTO[] = [];
  private _board: number[] = [];
  private _player: UserDto | undefined;
  private _opponent: UserDto | undefined;
  private _playerPicture: string = "";
  private _opponentPicture : string = "";
  private player_turn: number = 0;
  private _isPlayersTurn: boolean = false;
  private _winner: string = "";


  constructor(
    private http: HttpClient,
    private userService: UserService,
    private socketService: SocketService
  ) {
    this.socketService.onMoveMade().subscribe((update: GameUpdateDto) => {
      this._isPlayersTurn = update.turn === this.player_turn;
      this._board = update.board;
      if (update.isFinished) this._winner = update.winner;
    });
  }


  loadFromApi(){
    this.http.get<GameDto>(`${this.apiUrl}/game/active`).subscribe({
      next: (response: GameDto) => {
        this.initGameBoard(response);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404)
          this.userService.loadUserData();
        console.log(err);
      }
    })
  }


  initGameBoard(game: GameDto){
    this._board = game.board;
    this.chat = game.chat;
    if (game.playerIdentity === 1){
      this._player = game.player1;
      this._opponent = game.player2;
      this.player_turn = 1;
    } else {
      this._player = game.player2;
      this._opponent = game.player1;
      this.player_turn = 2;
    }
    this._isPlayersTurn = game.turn === this.player_turn;
    this.readProfilePicture(this._player.profilePictureId, true);
    this.readProfilePicture(this._opponent.profilePictureId, false);
  }

  readProfilePicture(id: number, isPlayer: boolean) {
    this.http.get(`/api/user/avatar/${id}`, {responseType: 'arraybuffer'}).subscribe(buffer => {
      if (isPlayer){
        this._playerPicture = URL.createObjectURL(new Blob([buffer]));
      } else {
        this._opponentPicture = URL.createObjectURL(new Blob([buffer]));
      }
    });
  }

  makeMove(move: MoveDto){
    if (this._winner !== "") return;
    if (!this._isPlayersTurn) return;
    if (this._board[move.position] !== 0) return;
    this._isPlayersTurn = false;
    this._board[move.position] = this.player_turn;
    this.socketService.makeMove(move);
  }


  get isPlayersTurn(): boolean {
    return this._isPlayersTurn;
  }

  get playerPicture(): string {
    return this._playerPicture;
  }

  get opponentPicture(): string {
    return this._opponentPicture;
  }

  get board(): number[] {
    return this._board;
  }


  get player(): UserDto | undefined {
    return this._player;
  }

  get opponent(): UserDto | undefined {
    return this._opponent;
  }
}
