import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {LoginService} from "../login/services/login.service";
import {AuthService} from "../../services/user/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): boolean {
    if (this.authService.isAuthenticated$) {
      return true;
    } else if (this.authService.isAuthenticated$ && !this.authService.isAdmin$) {
      this.router.navigate(['/forbidden']);
      return false;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
