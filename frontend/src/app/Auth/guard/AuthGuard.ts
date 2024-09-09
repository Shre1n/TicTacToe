import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { UserService } from '../../User/user.service';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate() {
    return this.userService.isAuthenticated().pipe(
      map((response: Response) => {
        if (response.ok)
          return true;
        this.router.navigate(['/unauthorized']);
        return false;
      }),
      catchError((_) => {
        this.router.navigate(['/unauthorized']);
        return of(false);
      })
    );
  }
}
