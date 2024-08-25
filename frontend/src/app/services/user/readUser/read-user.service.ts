import { Injectable } from '@angular/core';
import {UserDto} from "../../../User/player-profile/player-content/userDto";
import {HttpClient} from "@angular/common/http";
import {ReadUserProfilePictureService} from "../readUserProfilePicture/read-user-profile-picture.service";
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReadUserService {

  private _username = "";
  elo = 0;

  constructor(private http: HttpClient, private readProfilePictureService: ReadUserProfilePictureService) { }


  readUser(): Observable<UserDto> {
    return this.http.get<UserDto>(`/api/user/me`).pipe(
      tap((user: UserDto) => {
        this._username = user.username;
        this.elo = user.elo;
        this.readProfilePictureService.readProfilePicture(user.profilePictureId);
      })
    );
  }


  get username(): string {
    return this._username;
  }
}
