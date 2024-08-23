import { Injectable } from '@angular/core';
import {UserDto} from "../../../User/player-profile/player-content/userDto";
import {HttpClient} from "@angular/common/http";
import {ReadUserProfilePictureService} from "../readUserProfilePicture/read-user-profile-picture.service";

@Injectable({
  providedIn: 'root'
})
export class ReadUserService {

  private _username = "";
  elo = 0;

  constructor(private http: HttpClient, private readProfilePictureService: ReadUserProfilePictureService) { }


  readUser(): void {
    this.http.get<UserDto>(`/api/user/me`).subscribe((user: UserDto): void => {
      this._username = user.username;
      this.readProfilePictureService.readProfilePicture(user.profilePictureId)
      this.elo = user.elo;
    })
  }


  get username(): string {
    return this._username;
  }
}
