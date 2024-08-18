import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {LoginResponse} from "../interfaces/LoginResponse";
import {AuthService} from "../../../services/user/auth/auth.service";
import {flush} from "@angular/core/testing";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http : HttpClient,
    private router: Router,
    private authService: AuthService,
    ) { }


  login(username: string, password: string) {
    const user = { username, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth`, user);
  }

}
