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
  public games: Map<number, GameDto> = new Map();

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
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
        this.showGameOverAlert(update.id);
      }
    });

    this.socketService.onGiveup().subscribe((id: number) => {
      const game = this.games.get(id);
      if (!game) return;

      game.turn = 0;
      alert('The other player has given up!');
      this.router.navigate(['']);
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
        console.log(err);
      }
    });
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

  giveUp(id: number) {
    const game = this.games.get(id);
    if (!game || game.isFinished) return;

    game.turn = 0;
    this.socketService.giveUp(id);
    this.userService.setReady();
    alert('You have given up!');
    this.router.navigate(['']);
  }

  showGameOverAlert(id: number) {
    const game = this.games.get(id);
    if (!game || game.isFinished) return;

    if (game.winner === "draw")
      alert('is draw!');
    else if (game.winner === "p1") {
      alert('Congratulations, you won!');
    } else {
      alert('You lost. Better luck next time!');
    }
    this.router.navigate(['']);
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
