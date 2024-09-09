import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from "./Auth/login/login.component";
import { UserService } from './User/user.service';
import {ToastContainerComponent} from "./Notifications/toast-menu/toast-container/toast-container.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{


  constructor(userService: UserService) {
    userService.loadUserData();
  }


}
