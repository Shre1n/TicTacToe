import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { UserDto } from '../../../User/interfaces/userDto';
import { ApiEndpoints } from '../../../api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private http : HttpClient) { }


  login(username: string, password: string) {
    const user = { username, password };
    return this.http.post<UserDto>(ApiEndpoints.AUTH, user);
  }

}
