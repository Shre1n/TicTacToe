import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthService} from "./services/user/auth/auth.service";
import {LoginComponent} from "./Auth/login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  isAdmin: boolean = false;
  isAuthenticated: boolean = false;

  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      }
    );

    this.authService.isAdmin$.subscribe(
      (isAdmin) => {
        this.isAdmin = isAdmin;
      }
    );
  }

}
