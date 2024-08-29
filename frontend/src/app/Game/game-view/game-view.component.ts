import { Component } from '@angular/core';
import { UserService } from '../../User/user.service';
import { UserState } from '../../User/interfaces/userDto';
import { MatchMakingComponent } from '../match-making/match-making.component';
import { TicTacToeComponent } from '../tic-tac-toe/tic-tac-toe.component';

@Component({
  selector: 'app-game-view',
  standalone: true,
  imports: [
    MatchMakingComponent,
    TicTacToeComponent,
  ],
  templateUrl: './game-view.component.html',
  styleUrl: './game-view.component.css'
})
export class GameViewComponent {
  constructor(public userService: UserService) {
  }

  protected readonly UserState = UserState;
}
