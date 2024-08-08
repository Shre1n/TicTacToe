import {booleanAttribute, Component} from '@angular/core';
import {TictactoeService} from "../services/tictactoe.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [],
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.css'
})
export class TicTacToeComponent {

  //todo make move and sends to server
  cells: string[] = Array(9).fill('');
  yourElo: number = 0; // Dummy-Elo-Punkte für den Nutzer
  opponentElo: number = 0; // Dummy-Elo-Punkte für den Gegner
  gameStatus: string = 'In Progress';

  // private gameId: number;


  constructor(private tictactoeService: TictactoeService, private router: Router) {
  }


  makeMove(index: number): void {
    this.tictactoeService.makeAMove(index).subscribe({
      next: (response) =>{
        console.log('Move made successfully', response);

        //todo send updated board to server and ask if finished
      },
      error: (error) =>{
        console.error('Error making move', error);
      }
    });
  }
}
