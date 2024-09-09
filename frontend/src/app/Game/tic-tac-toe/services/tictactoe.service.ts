import { Injectable } from '@angular/core';
import { GameDto } from "../../interfaces/gamesDto";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SocketService } from "../../../Socket/socket.service";
import { MoveDto } from "../../interfaces/MoveDto";
import { GameUpdateDto } from "../../interfaces/GameUpdateDto";
import { UserService } from '../../../User/user.service';
import { ApiEndpoints } from '../../../api-endpoints';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TictactoeService {
  public game?: GameDto;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private socketService: SocketService
  ) {
    this.socketService.onMoveMade().subscribe((update: GameUpdateDto) => {
      if (!this.game) return;

      this.game.turn = update.turn;
      this.game.board = update.board;
      if (update.isFinished) {
        this.game.winner = update.winner;
        this.game.isFinished = update.isFinished;
        this.showGameOverAlert();
      }
    });

    this.socketService.onGiveup().subscribe(() => {
      if (!this.game) return;

      this.game.turn = 0;
      alert('The other player has given up!');
      this.router.navigate(['']);
    });
  }



  loadFromApi(){
    this.http.get<GameDto>(`${ApiEndpoints.USERGAME}`).subscribe({
      next: (response: GameDto) => {
        this.initGameBoard(response);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404)
          this.router.navigate(['NotFound']);
        console.log(err);
      }
    });
  }

  initGameBoard(game: GameDto){
    this.game = game;
    this.readProfilePictures(game);
  }

  readProfilePictures(game: GameDto) {
    this.http.get(`${ApiEndpoints.AVATAR}/${game.player1.profilePictureId}`, {responseType: 'arraybuffer'}).subscribe(buffer => {
      this.game!.player1.profilePictureUrl = URL.createObjectURL(new Blob([buffer]));
    });
    this.http.get(`${ApiEndpoints.AVATAR}/${game.player2.profilePictureId}`, {responseType: 'arraybuffer'}).subscribe(buffer => {
      this.game!.player2.profilePictureUrl = URL.createObjectURL(new Blob([buffer]));
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
    if (!this.game || this.game.isFinished) return;

    this.game.turn = 0;
    this.socketService.giveUp();
    alert('You have given up!');
    this.router.navigate(['']);
  }

  showGameOverAlert() {
    if (!this.game || this.game.isFinished) return;

    if (this.game.winner === "draw")
      alert('is draw!');
    else if (this.game.winner === "p1") {
      alert('Congratulations, you won!');
    } else {
      alert('You lost. Better luck next time!');
    }
    this.router.navigate(['']);
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
