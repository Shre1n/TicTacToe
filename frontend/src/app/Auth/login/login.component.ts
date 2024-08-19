import {Component, ElementRef, OnInit, Output, ViewChild} from '@angular/core';
import {LoginService} from "./services/login.service";
import {FormsModule, NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginResponse} from "./interfaces/LoginResponse";
import {ConnectService} from "../../services/connect.service";
import {SocketService} from "../../services/socket.service";
import {AuthService} from "../../services/user/auth/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{

  username: string = '';
  password: string = '';

  errors = new Map<string, string>();


  @ViewChild('_username')
  private _username!: any;
  @ViewChild('_password')
  private _password!: any;


  constructor(
    private loginService: LoginService,
    private router: Router,
    private connectService: ConnectService,
    private authService: AuthService,) {
  }



  onSubmit() {
    this.errors.clear();

    if (this.username.length == 0) {
      this.errors.set('_username', 'Bitte gebe einen Nutzernamen ein.');
    }
    if (this.password.length == 0) {
      this.errors.set('_password', 'Bitte gebe ein Passwort ein.');
    }


    if (this.errors.size === 0) {
      this.loginService.login(this.username, this.password).subscribe({
        next: (response: LoginResponse) => {
          if (response.isAdmin) {
            this.authService.isAuthenticated = true;
            this.authService.isAdmin = response.isAdmin;
            this.router.navigate(['/admin']);
          } else {
            this.authService.isAuthenticated = true;
            this.router.navigate(['/play-now']);
          }
          this.connectService.connect();
          //todo show user the success
        },
        error: error => {
          if (error.status === 403) {
            this.errors.set('_error', 'Der Nutzername oder das Passwort stimmt nicht.');
          }
        }
      });
    }
  }

  register() {
    this.router.navigate(['/register']);
  }
}
