import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {LoginService} from "../login/services/login.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {
  }

  canActivate(): boolean {

    if (this.loginService.isAuthenticated) {
      if (this.loginService.isAdmin) {
        this.router.navigate(['/forbidden']);
        return false;
      }
      return true;
    } else if (this.loginService.isAdmin) {
      this.router.navigate(['/forbidden']);
      return false;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
