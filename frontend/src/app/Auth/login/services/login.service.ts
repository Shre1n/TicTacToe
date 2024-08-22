import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {LoginResponse} from "../interfaces/LoginResponse";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http : HttpClient) { }


  login(username: string, password: string) {
    const user = { username, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth`, user);
  }

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

}
