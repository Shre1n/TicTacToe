import { Component } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [],
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.css'
})
export class TicTacToeComponent {

  //todo make move and sends to server
  yourElo: number = 0; // Dummy-Elo-Punkte für den Nutzer
  opponentElo: number = 0; // Dummy-Elo-Punkte für den Gegner

}
