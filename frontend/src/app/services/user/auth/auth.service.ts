import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}


  get isAuthenticated(): boolean {
    return !!window.localStorage.getItem('Auth');
  }

  get isAdmin(): boolean {
    return !!window.localStorage.getItem("Admin");
  }

  setAuthenticated(): void {
    window.localStorage.setItem("Auth","true");
  }

  setAdmin(): void {
    window.localStorage.setItem("Admin","true");
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth`, {}).subscribe({
      next: () => {

        if (this.isAuthenticated) window.localStorage.removeItem("Auth");
        if (this.isAdmin) window.localStorage.removeItem("Admin");

        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error during logout', err);
      },
    });
  }
}
