import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import {LoginResponse} from "../../../Auth/login/interfaces/LoginResponse";
import {ignoreElements} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';


  _isAdmin = false;
  _isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {}

  isAdmin(): boolean {
    this.http.post(`${this.apiUrl}/auth/admin-only`, {}).subscribe({
      next: () => {
        this._isAdmin = true;
        return this._isAdmin;
      },
      error: (err) => {
        if (err.status === 401) {
          this.router.navigate(['/unauthorized']);
          return false;
        }
        if (err.status === 403) {
          this.router.navigate(['/forbidden']);
          return false;
        }
        return false;
      }
    });
    return false;
  }

  isAuthenticated(): boolean{
    return this._isAuthenticated = true;
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth`, {}).subscribe({
      next: () => {
        this._isAdmin = false;
        this._isAuthenticated = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error during logout', err);
      },
    });
  }
}
