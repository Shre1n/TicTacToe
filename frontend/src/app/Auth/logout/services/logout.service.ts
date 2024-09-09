import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import { UserService } from '../../../User/user.service';
import { ApiEndpoints } from '../../../api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  constructor(private http: HttpClient, private userService: UserService, private router: Router) { }


  logout() {
    return this.http.delete(ApiEndpoints.AUTH, {}).subscribe({
      next: () => {
        this.userService.clear();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error during logout', err);
      },
    });
  }

}
