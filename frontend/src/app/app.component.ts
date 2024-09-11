import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {LoginComponent} from "./Auth/login/login.component";
import { UserService } from './User/user.service';
import {ToastContainerComponent} from "./Notifications/toast-menu/toast-container/toast-container.component";
import { SocketService } from './Socket/socket.service';
import { GameUpdateDto } from './Game/interfaces/GameUpdateDto';
import { UserDto } from './User/interfaces/userDto';
import { ToastService } from './Notifications/toast-menu/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {


  constructor( private userService: UserService, private socketService: SocketService, private router: Router, private toastService: ToastService) {
    userService.loadUserData();
  }

  ngOnInit(): void {
    this.socketService.onGameStarted().subscribe((opponent: UserDto) => {
      if (this.checkURL()) {
        return
      }
      this.userService.setPlaying()
      this.toastService.show('success', 'Game started!', `${opponent.username} is your opponent!` , 6, true );
    })
    this.socketService.onMoveMade().subscribe((game: GameUpdateDto) => {
      if (this.checkURL()) {
        return
      }
      if (!game.isFinished) {
        this.toastService.show('success', 'It is your turn!' , `Your opponent made his move on ${game.position}!`, 6, true );
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
