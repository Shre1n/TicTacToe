import {Component, ViewChild} from '@angular/core';
import {LoginService} from "./services/login.service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import { UserService } from '../../User/user.service';
import { UserDto } from '../../User/interfaces/userDto';
import { SocketService } from '../../Socket/socket.service';
import {ToastService} from "../../Notifications/toast-menu/services/toast.service";
import {ToastContainerComponent} from "../../Notifications/toast-menu/toast-container/toast-container.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ToastContainerComponent
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
    private socketService: SocketService,
    private userService: UserService,
    private toast:ToastService
    ) {
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
      this.loginService.login(this.username, this.password).pipe(this.userService.profilePicturePipe()).subscribe({
        next: (response: UserDto) => {
          this.userService.setUserData(response)
          if (response.isAdmin) {
            this.router.navigate(['/admin']);
          }
          this.socketService.connect();
          this.toast.show("success", "Erfolreich", "Sie haben sich erfolgreich Eingeloggt!",10, true);
        },
        error: error => {
          if (error.status === 403) {
            this.errors.set('_error', 'Der Nutzername oder das Passwort stimmt nicht.');
            this.toast.show('warning', 'Fehler', 'Ungültiger Benutzername oder Passwort.', 10);
          }
        }
      });
    }
  }

  register() {
    this.router.navigate(['/register']);
  }
}
