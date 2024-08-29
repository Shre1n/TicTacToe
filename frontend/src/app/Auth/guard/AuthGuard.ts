import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { UserService } from '../../User/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(): boolean {

    if (this.userService.isAuthenticated()) {
      if (this.userService.isAdmin()) {
        this.router.navigate(['/forbidden']);
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
