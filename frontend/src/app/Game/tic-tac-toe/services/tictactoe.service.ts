import { Injectable } from '@angular/core';
import { GameDto } from "../../interfaces/gamesDto";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SocketService } from "../../../Socket/socket.service";
import { MoveDto } from "../../interfaces/MoveDto";
import { GameUpdateDto } from "../../interfaces/GameUpdateDto";
import { ApiEndpoints } from '../../../api-endpoints';
import { Router } from '@angular/router';
import { map, mergeMap, of } from 'rxjs';
import { UserService } from '../../../User/user.service';

@Injectable({
  providedIn: 'root'
})
export class TictactoeService {
  public game?: GameDto;

  constructor(
    private http: HttpClient,
    private router: Router,
    private socketService: SocketService,
    private userService: UserService,
  ) {
    this.socketService.onMoveMade().subscribe((update: GameUpdateDto) => {
      if (!this.game) return;

      this.game.turn = update.turn;
      this.game.board = update.board;
      if (update.isFinished) {
        this.game.winner = update.winner;
        this.game.isFinished = update.isFinished;
        this.showGameOverAlert();
        this.userService.setReady();
      }
    });

    this.socketService.onGiveup().subscribe(() => {
      if (!this.game) return;

      this.game.turn = 0;
      alert('The other player has given up!');
      this.router.navigate(['']).then();
      this.userService.setReady();
    });
  }



  loadFromApi(){
    this.http.get<GameDto>(`${ApiEndpoints.USERGAME}`)
      .pipe(this.profilePicturePipe(1))
      .pipe(this.profilePicturePipe(2))
      .subscribe({
        next: (response: GameDto) => {
          this.initGameBoard(response);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404)
            this.router.navigate(['NotFound']).then();
          console.log(err);
        }
      });
  }

  initGameBoard(game: GameDto){
    this.game = game;
  }

  profilePicturePipe(player: number) {
    return mergeMap((game: GameDto, _) => {
      if (player === 1)
        return game.player1.profilePictureId ? this.http.get(`${ApiEndpoints.AVATAR}/${game.player1.profilePictureId}`, {responseType: 'arraybuffer'})
          .pipe(map((pic): GameDto => {
            const p1 = { ...game.player1, profilePictureUrl: URL.createObjectURL(new Blob([pic])) };
            return {...game, player1: p1}
          })) : of(game);
      if (player === 2)
        return game.player2.profilePictureId ? this.http.get(`${ApiEndpoints.AVATAR}/${game.player2.profilePictureId}`, {responseType: 'arraybuffer'})
          .pipe(map((pic): GameDto => {
            const p2 = { ...game.player2, profilePictureUrl: URL.createObjectURL(new Blob([pic])) };
            return {...game, player2: p2}
          })) : of(game)
      return of(game);
    });
  }

  makeMove(move: MoveDto){
    if (!this.game || this.game.isFinished) return;
    if (!this.isPlayerTurn()) return;
    if (this.game.board[move.position] !== 0) return;

    this.game.turn = this.game.playerIdentity === 1 ? 2 : 1;
    this.game.board[move.position] = this.game.playerIdentity;
    this.socketService.makeMove(move);
  }

  giveUp() {
    if (!this.game) return;

    this.game.turn = 0;
    this.socketService.giveUp();
    alert('You have given up!');
    this.router.navigate(['']).then();
    this.userService.setReady();
  }

  showGameOverAlert() {
    if (!this.game) return;

    if (this.game.winner === "draw")
      alert('is draw!');
    else if (this.game.winner === "p1") {
      alert('Congratulations, you won!');
    } else {
      alert('You lost. Better luck next time!');
    }
    this.router.navigate(['']).then();
  }

  getPlayer() {
    if (!this.game) return null;

    if (this.game.playerIdentity === 1) return this.game.player1;
    else return this.game.player2;
  }

  getOpponent() {
    if (!this.game) return null;

    if (this.game.playerIdentity === 1) return this.game.player2;
    else return this.game.player1;
  }

  isPlayerTurn(): boolean {
    return this.game !== undefined && this.game.turn === this.game.playerIdentity;
  }
}
