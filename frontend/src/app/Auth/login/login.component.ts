import {Component, ViewChild} from '@angular/core';
import {LoginService} from "./services/login.service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import { UserService } from '../../User/user.service';
import { UserDto } from '../../User/interfaces/userDto';
import { SocketService } from '../../Socket/socket.service';
import {ToastService} from "../../Notifications/toast-menu/services/toast.service";
import {ToastContainerComponent} from "../../Notifications/toast-menu/toast-container/toast-container.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ToastContainerComponent,
    NgClass
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{

  username: string = '';
  password: string = '';

  passwordFieldType: string = 'password';

  isSubmitted: boolean = false;

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

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }


  checkAccess(){
    this.loginService.login(this.username, this.password).pipe(this.userService.profilePicturePipe()).subscribe({
      next: (response: UserDto) => {
        this.isSubmitted = false;
        this.userService.setUserData(response);
        if (response.isAdmin) {
          this.router.navigate(['/admin']);
        }
        this.socketService.connect();
        this.toast.show('success', 'Success', "You logged in Successfully.");
      },
      error: error => {
        this.isSubmitted = false;
        if (error.status === 403) {
          this.errors.set('_error', 'Username or Password is Invalid.');
          this.toast.show('warning', 'Fehler', 'Username or Password is Invalid.', 10);
        }
      }
    });
  }

  onSubmit() {
    if (this.isSubmitted)
      return;
    this.isSubmitted = true;
    this.errors.clear();

    if (this.username.trim().length == 0) {
      this.errors.set('_username', 'The Username should not be Empty.');
    }
    if (this.password.trim().length == 0) {
      this.errors.set('_password', 'The Password should not be Empty.');
    }


    if (this.errors.size === 0) {
      this.checkAccess();
    }
  }

  register() {
    this.router.navigate(['/register']);
  }
}
