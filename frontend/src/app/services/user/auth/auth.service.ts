import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import {LoginResponse} from "../../../Auth/login/interfaces/LoginResponse";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';


  _isAdmin = false;
  private _isAuthenticated = false;


  get isAdmin(): boolean {
    return this._isAdmin;
  }

  constructor(private http: HttpClient, private router: Router) {}

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
