import { Component } from '@angular/core';
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

  constructor(private loginService: LoginService, private router: Router, private connectService: ConnectService) {}


  onSubmit() {
      this.loginService.login(this.username, this.password).subscribe({
        next: (response: LoginResponse) => {
          if (response.isAdmin) {
            this.router.navigate(['/admin']);
            this.loginService.setAdminStatus(true);
          }
          else
            this.router.navigate(['/play-now']);
          this.connectService.connect();
          //todo show user the success
        },
        error: () => {
          alert('No Login!')
        },
        complete: () => {
          console.info('Login-Prozess abgeschlossen.');
        }
      });
  }

  register(){
    this.router.navigate(['/register']);
  }
}
