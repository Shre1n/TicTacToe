import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginService} from "../services/login.service";
import {FormsModule, NgForm} from "@angular/forms";
import {Router} from "@angular/router";

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

  constructor(private loginService: LoginService, private router: Router) {}


  onSubmit() {
      this.loginService.login(this.username, this.password).subscribe({
        next: response => {
          this.router.navigate(['play-now'])
          //todo show user the success
          console.log(response);
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
