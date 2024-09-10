import { Component } from '@angular/core';
import {UserState} from "../interfaces/userDto";
import {UserService} from "../user.service";
import {SocketService} from "../../Socket/socket.service";
import {Router} from "@angular/router";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-status-indikator',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './status-indikator.component.html',
  styleUrl: './status-indikator.component.css'
})
export class StatusIndikatorComponent {
  constructor(
    private router: Router,
    private socketService: SocketService,
    public userService: UserService
  ) {}

    protected readonly UserState = UserState;

  navMatchMaking(){
    if (this.userService.getUserState() === UserState.Ready) {
      this.socketService.enterQueue();
      this.userService.setWaiting();
    }
    this.router.navigate(['/game']);
  }
}
