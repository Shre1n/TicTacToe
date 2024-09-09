import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {LogoutService} from "../../../Auth/logout/services/logout.service";
import {UserService} from "../../../User/user.service";

@Component({
  selector: 'app-nav-home',
  standalone: true,
  imports: [],
  templateUrl: './nav-home.component.html',
  styleUrl: './nav-home.component.css'
})
export class NavHomeComponent {
  constructor(
    private router: Router,
    private logOut: LogoutService,

    public userService: UserService
  ) {}


  logout(){
    this.logOut.logout();
  }

  navProfile(){
    this.router.navigate(['/profile'])
  }
}
