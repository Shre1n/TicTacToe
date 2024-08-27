import { Injectable } from '@angular/core';
import {GameDto} from "../../Admin/admin-dashboard/interfaces/Game/gamesDto";
import {ReadUserService} from "../../services/user/readUser/read-user.service";
import {UserDto} from "../../User/player-profile/player-content/userDto";
import {HttpClient} from "@angular/common/http";
import {SocketService} from "../../services/socket.service";
import {MoveDto} from "../../services/user/interfaces/MoveDto";
import {catchError, filter, Observable, of, switchMap, tap} from "rxjs";
import {GameUpdateDto} from "../../services/user/interfaces/GameUpdateDto";

@Injectable({
  providedIn: 'root'
})
export class TictactoeService {


  private apiUrl = 'http://localhost:3000/api';

  public _gameId: number = 0;
  private _board: number[] = [];
  private _player: UserDto | undefined;
  private _opponent: UserDto | undefined;
  private _playerPicture: string = "";
  private _opponentPicture : string = "";
  private player_turn: number = 0;
  private _isPlayersTurn: boolean = false;
  private _winner: string = "";


  constructor(
    private readUser: ReadUserService,
    private http: HttpClient,
    private socketService: SocketService
  ) { }

  moveMade(update: GameUpdateDto){
    this._isPlayersTurn = update.turn === this.player_turn;
    this._board = update.board;
    if (update.isFinished) this._winner = update.winner;
  }

  getActiveGame(): Observable<GameDto> {
    return this.http.get<GameDto>(`${this.apiUrl}/game/active`, { withCredentials: true });
  }

  loadFromApi(): Observable<GameDto| undefined> {
    return this.readUser.readUser().pipe(
      switchMap(() => this.http.get<GameDto>(`${this.apiUrl}/game/active`)),
      tap((response: GameDto) => {
        this.initGameBoard(response);
      }),
      catchError(err => {
        console.error('Failed to load game:', err);
        return of(void 0);  // returns empty observable
      })
    );
  }


  initGameBoard(game: GameDto){
    this._board = game.board;
    if (game.player1.username === this.readUser.username){
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
    this.socketService.emit('makeMove', move);
  }


  set gameId(value: number) {
    console.log(value)
    this._gameId = value;
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


  get gameId(): number {
    return this._gameId;
  }
}
