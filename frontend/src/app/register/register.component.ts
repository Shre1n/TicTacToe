import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterService} from "../services/register.service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  username: string = '';
  password: string = '';

  constructor(private registerService: RegisterService, private router: Router) {}

  onSubmit() {



      this.registerService.register(this.username, this.password)
        .subscribe({
          next: response => {
            alert('Registrierung erfolgreich!');
          },
          error: error => {
            alert('Fehler bei der Registrierung.');
          },
          complete: () => {
            console.info('Registrierungsprozess abgeschlossen.');
          }
        });

  }

  navLogin(){
    this.router.navigate(['login'])
  }

}
