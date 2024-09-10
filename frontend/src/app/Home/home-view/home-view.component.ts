import { Component } from '@angular/core';
import { UserService } from '../../User/user.service';
import { PlayNowComponent } from '../play-now/play-now.component';
import { LoginComponent } from '../../Auth/login/login.component';
import {ToastMenuComponent} from "../../Notifications/toast-menu/toast-menu.component";

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [PlayNowComponent, LoginComponent, ToastMenuComponent],
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.css'
})
export class HomeViewComponent {
  ready: boolean = false;
  constructor(public userService: UserService) {
    userService.userDataLoaded.subscribe(value => {this.ready = value; });
  }
}
