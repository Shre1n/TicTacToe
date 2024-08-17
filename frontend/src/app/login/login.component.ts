import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoginService} from "./services/login.service";
import {FormsModule, NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginResponse} from "./interfaces/LoginResponse";
import {ConnectService} from "../services/connect.service";
import {SocketService} from "../services/socket.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  errors = new Map<string, string>();

  @ViewChild('_username')
  private _username!: any;
  @ViewChild('_password')
  private _password!: any;


  constructor(private loginService: LoginService, private router: Router, private connectService: ConnectService) {
  }


  onSubmit() {
    this.errors.clear();

    if (this._username.trim().length === 0) {
      this.errors.set('username', 'Bitte gebe einen Nutzernamen ein.');
    }
    if (!this.isPasswordValid(this._password)) {
      this.errors.set('username', 'Bitte gebe einen Nutzernamen ein.');
    }


    if (this.errors.size === 0) {
      this.loginService.login(this.username, this.password).subscribe({
        next: (response: LoginResponse) => {
          if (response.isAdmin) {
            this.router.navigate(['/admin']);
            this.loginService.setAdminStatus(true);
          } else
            this.router.navigate(['/play-now']);
          this.connectService.connect();
          //todo show user the success
        },
        error: () => {
          alert('No Login!')
        }
      });
    }
  }

  isPasswordValid(password: string): boolean {
    const minLength = 6;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasLower && hasUpper && hasNumber && hasSymbol;
  }

  register() {
    this.router.navigate(['/register']);
  }
}
