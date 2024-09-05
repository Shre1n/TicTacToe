import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { UserService } from '../../../User/user.service';
import { catchError, map, of } from 'rxjs';
import { UserDto } from '../../../User/interfaces/userDto';
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService) {
  }

  canActivate() {
    return this.userService.isAuthenticated().pipe(
      map((response: UserDto) => {
        if (response && response.isAdmin)
          return true;
        else if (response)
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
