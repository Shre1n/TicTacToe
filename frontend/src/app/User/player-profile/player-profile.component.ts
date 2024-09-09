import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {OptionsComponent} from "./options/options.component";
import {PlayerContentComponent} from "./player-content/player-content.component";
import {PlayerPasswordChangeComponent} from "./player-password-change/player-password-change.component";
import {LogoutService} from "../../Auth/logout/services/logout.service";
import {SocketService} from "../../Socket/socket.service";
import {UserService} from "../user.service";
import {StatusIndikatorComponent} from "../status-indikator/status-indikator.component";

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [
    OptionsComponent,
    PlayerContentComponent,
    PlayerPasswordChangeComponent,
    StatusIndikatorComponent
  ],
  templateUrl: './player-profile.component.html',
  styleUrl: './player-profile.component.css'
})
export class PlayerProfileComponent {

  constructor(
    private router: Router,
    private logOut: LogoutService,
    private socketService: SocketService,
    public userService: UserService
  ) {}

  back(){
    this.router.navigate(['/']);
  }

  logout(){
    this.logOut.logout();
  }

  navProfile(){
    this.router.navigate(['/profile'])
  }

  activeTab: string = 'general';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }



}
