import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) { }


  logout() {
    return this.http.post(`${this.apiUrl}/auth`, {}).subscribe({
      next: () => {

        window.localStorage.clear();

        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error during logout', err);
      },
    });
  }

}
