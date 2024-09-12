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
import { ToastService } from '../../../Notifications/toast-menu/services/toast.service';
import { UserState } from '../../../User/interfaces/userDto';

@Injectable({
  providedIn: 'root'
})
export class TictactoeService {
  public game?: GameDto;
  public isSpectating = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private socketService: SocketService,
    private userService: UserService,
    private toastService: ToastService,
  ) {
    userService.userDataLoaded.subscribe(() => {
      if(userService.user?.state === UserState.Playing)
        this.loadFromApi();
    });

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
      if (!this.isSpectating) {
        this.toastService.show('success', 'You won the game', 'The other player has given up!', 6, true)
        this.router.navigate(['']).then();
        this.userService.setReady();
      } else {
        this.toastService.show('success', 'The Game ended!', 'A player has given up!', 6, true)
        this.router.navigate(['/admin']);
      }
      this.game = undefined
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
          console.error(err);
          this.toastService.show('error', "HTTP Error", "Error while loading the game!");
        }
      });
  }

  initGameBoard(game: GameDto, isSpectating: boolean = false) {
    this.game = game;
    this.isSpectating = isSpectating;
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
    this.toastService.show('error', 'You lost the game', 'You have given up!', 6, false)
    this.router.navigate(['']).then();
    this.userService.setReady();
    this.game = undefined
  }

  showGameOverAlert() {
    if (!this.game) return;
    if (this.isSpectating) {
      if (this.game.winner === 'draw')
        this.toastService.show('success', 'The game ended!', 'The game ended in a draw!', 6, true)
      else
        this.toastService.show('success', 'The game ended!', `${this.game.winner === 'p1' ? this.game.player1.username : this.game.player2.username} has won the game!`, 6, true)
      this.router.navigate(['/admin']);
    } else {
      if (this.game.winner === "draw")
        this.toastService.show('warning', 'Draw!', 'Your game ended in a draw!', 6, true)
      else if ((this.game.winner === "p1" && this.game.playerIdentity === 1) || (this.game.winner === "p2" && this.game.playerIdentity === 2)) {
        this.toastService.show('success', 'You won the game!', 'Congratulations, you won!', 6, true)
      } else {
        this.toastService.show('error', 'Game Over!', `You lost the game!`, 6, true)
      }
      this.router.navigate(['']).then();
    }
      this.game = undefined
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
