import { Injectable } from '@angular/core';
import { GameDto } from "../../interfaces/gamesDto";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SocketService } from "../../../Socket/socket.service";
import { MoveDto } from "../../interfaces/MoveDto";
import { GameUpdateDto } from "../../interfaces/GameUpdateDto";
import { ApiEndpoints } from '../../../api-endpoints';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TictactoeService {
  public games: Map<number, GameDto> = new Map();


  constructor(
    private http: HttpClient,
    private router: Router,
    private socketService: SocketService
  ) {
    this.socketService.onMoveMade().subscribe((update: GameUpdateDto) => {
      const game = this.games.get(update.id);
      if (!game) return;

      game.turn = update.turn;
      game.board = update.board;
      if (update.isFinished) {
        game.winner = update.winner;
        game.isFinished = update.isFinished;
      }
    });
  }


  loadFromApi(id: number){
    this.http.get<GameDto>(`${ApiEndpoints.GAME}/${id}`).subscribe({
      next: (response: GameDto) => {
        this.initGameBoard(response);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404)
          this.router.navigate(['NotFound']);

      }
    })
  }

  initGameBoard(game: GameDto){
    this.games.set(game.id, game);
    this.readProfilePictures(game);
  }

  readProfilePictures(game: GameDto) {
    this.http.get(`${ApiEndpoints.AVATAR}/${game.player1.profilePictureId}`, {responseType: 'arraybuffer'}).subscribe(buffer => {
      this.games.get(game.id)!.player1.profilePictureUrl = URL.createObjectURL(new Blob([buffer]));
    });
    this.http.get(`${ApiEndpoints.AVATAR}/${game.player2.profilePictureId}`, {responseType: 'arraybuffer'}).subscribe(buffer => {
      this.games.get(game.id)!.player2.profilePictureUrl = URL.createObjectURL(new Blob([buffer]));
    });
  }

  makeMove(move: MoveDto){
    const game = this.games.get(move.id);
    if (!game || game.isFinished) return;
    if (!this.isPlayerTurn(game)) return;
    if (game.board[move.position] !== 0) return;

    game.turn = game.playerIdentity === 1 ? 2 : 1;
    game.board[move.position] = game.playerIdentity;
    this.socketService.makeMove(move);
  }

  getPlayer(id: number) {
    const game = this.games.get(id);
    if (!game) return null;

    if (game.playerIdentity === 1) return game.player1;
    else return game.player2;
  }

  getOpponent(id: number) {
    const game = this.games.get(id);
    if (!game) return null;

    if (game.playerIdentity === 1) return game.player2;
    else return game.player1;
  }

  isPlayerTurn(game: GameDto): boolean {
    return game.turn === game.playerIdentity;
  }
}
