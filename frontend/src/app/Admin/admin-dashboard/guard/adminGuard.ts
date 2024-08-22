import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {LoginService} from "../../../Auth/login/services/login.service";
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private loginService: LoginService) {
  }

  canActivate() {
    if (this.loginService.isAdmin) {
      return true;
    } else if (!this.loginService.isAuthenticated) {
      this.router.navigate(['/unauthorized']);
      return false;
    } else {
      this.router.navigate(['/forbidden']);
      return false;
    }
  }
}
