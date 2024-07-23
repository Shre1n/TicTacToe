import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:3000/auth/register';

  constructor(private http: HttpClient ) { }

  register(username: string, password: string) {
    const user = { username, password };
    return this.http.post(this.apiUrl, user);
  }

}
