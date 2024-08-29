import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {LoginService} from "../../../Auth/login/services/login.service";
import { UserService } from '../../../User/user.service';
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService) {
  }

  canActivate() {
    if (this.userService.isAdmin()) {
      return true;
    } else if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/unauthorized']);
      return false;
    } else {
      this.router.navigate(['/forbidden']);
      return false;
    }
  }
}
