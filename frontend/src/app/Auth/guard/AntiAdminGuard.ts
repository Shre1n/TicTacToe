import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { UserService } from '../../User/user.service';
import { catchError, map, of } from 'rxjs';
import { UserDto } from '../../User/interfaces/userDto';

@Injectable({
  providedIn: 'root'
})
export class AntiAdminGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate() {
    return this.userService.isAuthenticated().pipe(
      map((response: UserDto) => {
        if (response && !response.isAdmin)
          return true;
        if (response && response.isAdmin)
          this.router.navigate(['/forbidden']);
        else
          this.router.navigate(['']);
        return false;
      }),
      catchError((_) => {
        this.router.navigate(['']);
        return of(false);
      })
    );
  }
}
