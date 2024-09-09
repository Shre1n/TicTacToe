import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '../../Auth/logout/services/logout.service';
import { UserService } from '../../User/user.service';
import { UserState } from '../../User/interfaces/userDto';
import { SocketService } from '../../Socket/socket.service';
import {NgClass} from "@angular/common";
import {StatusIndikatorComponent} from "../../User/status-indikator/status-indikator.component";
import {ToastMenuComponent} from "../../Notifications/toast-menu/toast-menu.component";

@Component({
  selector: 'app-play-now',
  standalone: true,
  imports: [
    NgClass,
    StatusIndikatorComponent,
    ToastMenuComponent
  ],
  templateUrl: './play-now.component.html',
  styleUrl: './play-now.component.css'
})
export class PlayNowComponent {


  constructor(
    private router: Router,
    private logOut: LogoutService,
    private socketService: SocketService,
    public userService: UserService
    ) {}

  logout(){
    this.logOut.logout();
  }

  navProfile(){
    this.router.navigate(['/profile'])
  }


  navMatchMaking(){
    if (this.userService.getUserState() === UserState.Ready) {
      this.socketService.enterQueue();
      this.userService.setWaiting();
    }
    this.router.navigate(['/game']);
  }

  protected readonly UserState = UserState;

}
