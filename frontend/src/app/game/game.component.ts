import {Component} from '@angular/core';
import {Players} from "../enums/players.enum";
import {GameService} from "../services/game.service";
import {GameStatus} from "../enums/gameStates.Enum";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  board!: string[];
  currentPlayer!: Players;
  message!: string;
  Players = Players;          // Enum
  GameStatus = GameStatus;    //Enum

  constructor(private gameService: GameService) {
    this.resetGame();
  }

  resetGame() {
    this.board = Array(9).fill(null);
    this.currentPlayer = this.gameService.getCurrentPlayer();
    this.message = '';
  }

  play(position: number) {
    try {
      const result = this.gameService.play(position);

      this.board[position] = this.currentPlayer === Players.Player1 ? 'X' : 'O';

      switch (result) {
        case GameStatus.Won:
          this.message = `${this.currentPlayer === Players.Player1 ? 'Player 1' : 'Player 2'} wins!`;
          break;
        case GameStatus.Lost:
          this.message = `${this.currentPlayer === Players.Player1 ? 'Player 2' : 'Player 1'} wins!`;
          break;
        case GameStatus.Draw:
          this.message = 'It\'s a draw!';
          break;
        case GameStatus.Ongoing:
          this.currentPlayer = this.gameService.getCurrentPlayer();
          break;
      }
    } catch (error) {
      if (error instanceof Error) {
        this.message  = error.message;
      } else this.message = 'An unknown error occurred';
    }
  }
}
