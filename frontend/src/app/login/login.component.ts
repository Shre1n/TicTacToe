import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginService} from "../services/login.service";
import {FormsModule} from "@angular/forms";

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

  constructor(private loginService: LoginService) {}


  onSubmit() {
    this.loginService.login(this.username, this.password).subscribe({
      next: response => {
        alert('Login erfolgreich!');
        console.log(response);
      },
      error: error => {
        alert('Fehler beim Login.');
        console.error(error);
      },
      complete: () => {
        console.info('Login-Prozess abgeschlossen.');
      }
    });
  }




}
