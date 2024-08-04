import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http : HttpClient) { }


  login(username: string, password: string) {
    const user = { username, password };
    console.log(user)
    return this.http.post(this.apiUrl, user);
  }


}
