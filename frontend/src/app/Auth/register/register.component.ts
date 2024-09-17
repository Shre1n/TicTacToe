import {Component, ViewChild} from '@angular/core';
import {RegisterService} from "./services/register.service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import { UserDto } from '../../User/interfaces/userDto';
import { UserService } from '../../User/user.service';
import {ToastService} from "../../Notifications/toast-menu/services/toast.service";
import {NgClass} from "@angular/common";
import {SocketService} from "../../Socket/socket.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  username: string = '';
  password: string = '';
  password_confirmation: string = '';

  passwordFieldType: string = 'password';
  passwordConfirmFieldType: string = 'password';

  errors = new Map<string, string>();

  @ViewChild('_username')
  private _username!: any;
  @ViewChild('_password')
  private _password!: any;
  @ViewChild('_password_confirm')
  private _password_confirm!: any;

  constructor(private registerService: RegisterService,
              private userService: UserService,
              private router: Router,
              private toastService: ToastService,
              private socketService: SocketService) {
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  togglePasswordConfirmVisibility() {
    this.passwordConfirmFieldType = this.passwordConfirmFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    this.errors.clear();

    if (this.username.trim().length === 0){
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
            this.socketService.connect();
            this.router.navigate([''])
            this.toastService.show("success", "Success", "You Registered Successfully!",6,true);
          },
          error: error => {
            if (error.status === 400) {
              this.toastService.show('error',"Username","That Username is already taken.",6,false);
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
