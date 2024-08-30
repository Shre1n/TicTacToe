import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { UserDto } from '../../../User/interfaces/userDto';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http : HttpClient) { }


  login(username: string, password: string) {
    const user = { username, password };
    return this.http.post<UserDto>(`${this.apiUrl}/auth`, user);
  }

}
