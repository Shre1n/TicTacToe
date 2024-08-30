import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import { UserService } from '../../../User/user.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private userService: UserService, private router: Router) { }


  logout() {
    return this.http.delete(`${this.apiUrl}/auth`, {}).subscribe({
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
