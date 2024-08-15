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
}
