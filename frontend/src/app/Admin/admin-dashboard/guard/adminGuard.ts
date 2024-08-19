import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {LoginService} from "../../../Auth/login/services/login.service";
import {AuthService} from "../../../services/user/auth/auth.service";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService) {
  }

  canActivate() {
    if (this.authService.isAdmin$) {
      return this.authService.isAdmin$;
    } else if (!this.authService.isAuthenticated$){
      this.router.navigate(['/unauthorized']);
      return false;
    } else {
      this.router.navigate(['/forbidden']);
      return false;
    }
  }
}
