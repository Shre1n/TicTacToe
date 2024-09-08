import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {LoginComponent} from "./Auth/login/login.component";
import { UserService } from './User/user.service';
import { SocketService } from './Socket/socket.service';
import { GameDto } from './Game/interfaces/gamesDto';
import { GameUpdateDto } from './Game/interfaces/GameUpdateDto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {


  constructor(userService: UserService, private socketService: SocketService, private router: Router) {
    userService.loadUserData();
  }

  ngOnInit(): void {
    this.socketService.onGameStarted().subscribe((game: GameDto) => {
      if (this.checkURL()) {
        return
      }

    })
    this.socketService.onMoveMade().subscribe((game: GameUpdateDto) => {
      if (this.checkURL()) {
        return
      }

    })
    }

  checkURL() {
    const currentUrl = this.router.url;

    if (currentUrl !== '/game') {
      console.log('NICHT auf der Game-Seite');
      return false;
    } else {
      console.log('sind auf der game-Seite');
      return true;
    }
  }



}
