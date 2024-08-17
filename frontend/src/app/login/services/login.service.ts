import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {LoginResponse} from "../interfaces/LoginResponse";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http : HttpClient, private router: Router) { }

  login(username: string, password: string) {
    const user = { username, password };
    return this.http.post<LoginResponse>(this.apiUrl, user);
  }

  setAdminStatus(isAdmin: boolean) {
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
  }

  setAuthStatus(isAuth: boolean) {
    if (this.isAdmin())
      return;
    localStorage.setItem('auth', JSON.stringify(isAuth));
  }

  removeLocalStorage(){
    if (this.isAdmin())
      localStorage.removeItem('isAdmin');
    if (this.isAuthenticated()){
      localStorage.removeItem('auth');
    }
  }

  isAuthenticated(): boolean {
    const token = JSON.parse(localStorage.getItem('auth') || 'false');
    return !!token;
  }

  isAdmin(): boolean {
    return JSON.parse(localStorage.getItem('isAdmin') || 'false');
  }
}
