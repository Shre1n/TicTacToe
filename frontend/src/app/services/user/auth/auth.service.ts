import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import {LoginResponse} from "../../../Auth/login/interfaces/LoginResponse";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  private _isAdmin = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient, private router: Router) {}


  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  get isAdmin$(): Observable<boolean> {
    return this._isAdmin.asObservable();
  }

  // Methoden zum Setzen des Wertes
  setAuthenticated(value: boolean): void {
    this._isAuthenticated.next(value);
  }

  setAdmin(value: boolean): void {
    this._isAdmin.next(value);
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth`, {}).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error during logout', err);
      },
    });
  }
}
