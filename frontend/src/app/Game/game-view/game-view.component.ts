import { Component, OnInit } from '@angular/core';
import { UserService } from '../../User/user.service';
import { UserState } from '../../User/interfaces/userDto';
import { MatchMakingComponent } from '../match-making/match-making.component';
import { TicTacToeComponent } from '../tic-tac-toe/tic-tac-toe.component';
import { SocketService } from '../../Socket/socket.service';

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
export class GameViewComponent implements OnInit {
  constructor(public userService: UserService, private socketService: SocketService) {
  }

  ngOnInit(): void {
        this.userService.userDataLoaded.subscribe(value => {
          if (value && this.userService.getUserState() === UserState.Ready) {
            this.socketService.enterQueue();
            this.userService.setWaiting();
          }
        });
  }

  protected readonly UserState = UserState;
}
