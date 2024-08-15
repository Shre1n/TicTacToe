import { Injectable } from '@angular/core';
import {UserDto} from "../../../player-profile/player-content/userDto";
import {HttpClient} from "@angular/common/http";
import {ReadUserProfilePictureService} from "../readUserProfilePicture/read-user-profile-picture.service";

@Injectable({
  providedIn: 'root'
})
export class ReadUserService {

  username = "";
  elo = 0;

  constructor(private http: HttpClient, private readProfilePictureService: ReadUserProfilePictureService) { }


  readUser(): void {
    this.http.get<UserDto>(`/api/user/me`).subscribe((user: UserDto): void => {
      this.username = user.username;
      this.readProfilePictureService.readProfilePicture(user.profilePictureId)
      this.elo = user.elo;
    })
  }

}
