import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { UserService } from '../../../User/user.service';
import { catchError, map, of } from 'rxjs';
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
    }
    return this.userService.isAuthenticated().pipe(
      map((response: Response) => {
        if (response.ok)
          this.router.navigate(['/forbidden']);
        else
          this.router.navigate(['/unauthorized'])
        return false;
      }),
      catchError((_) => {
        this.router.navigate(['/unauthorized']);
        return of(false);
      })
    );
  }
}
