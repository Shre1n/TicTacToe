import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import {LoginResponse} from "../../../Auth/login/interfaces/LoginResponse";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';


  private _isAdminSubject = new BehaviorSubject<boolean>(false);
  private _isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}


  get isAdmin(): Observable<boolean> {
    return this._isAdminSubject.asObservable();
  }

  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticatedSubject.asObservable();
  }

  // Setter, um den Wert zu aktualisieren und Benachrichtigungen auszulösen
  set isAdmin(value: boolean) {
    this._isAdminSubject.next(value);
  }

  set isAuthenticated(value: boolean) {
    this._isAuthenticatedSubject.next(value);
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth`, {}).subscribe({
      next: () => {
        this.isAdmin = false;
        this.isAuthenticated = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error during logout', err);
      },
    });
  }
}
