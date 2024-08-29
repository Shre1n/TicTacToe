import {Component, ViewChild} from '@angular/core';
import {RegisterService} from "./services/register.service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import { UserDto } from '../../User/interfaces/userDto';
import { UserService } from '../../User/user.service';

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
  password_confirmation: string = '';

  errors = new Map<string, string>();

  @ViewChild('_username')
  private _username!: any;
  @ViewChild('_password')
  private _password!: any;
  @ViewChild('_password_confirm')
  private _password_confirm!: any;

  constructor(private registerService: RegisterService, private userService: UserService, private router: Router) {
  }

  onSubmit() {
    this.errors.clear();

    if (this.username.trim() === ''){
      this.errors.set('_username', 'Bitte gib einen Nutzernamen ein.');
      return;
    }

    if (!this.isPasswordValid(this.password)) {
      this.errors.set('_password', 'Das Passwort muss mind. 6 Zeichen lang sein. Es muss einen kleinen, sowie einen groß Buchstaben enthalten. Genauso wie eine Nummer und ein Sonderzeichen. ');
      return;
    }

    if (this.password !== this.password_confirmation) {
      this.errors.set('_password_confirm', 'Die Passwörter stimmen nicht überein.')
      return;
    }

    if (this.errors.size === 0){
      this.registerService.register(this.username, this.password)
        .subscribe({
          next: (response: UserDto) => {
            this.userService.setUserData(response);
            this.router.navigate([''])
          },
          error: error => {
            if (error.status === 400 && error.error.message === 'Username already exists') {
              this.errors.set('_username', 'Der Benutzername existiert bereits.');
            } else {
              alert('Fehler bei der Registrierung.');
            }
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

  navLogin() {
    this.router.navigate([''])
  }

}
