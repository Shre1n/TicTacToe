import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ReadUserProfilePictureService {

  profilePicture = '';


  constructor(private http: HttpClient) { }

  readProfilePicture(id: number) {
    this.http.get(`/api/user/avatar/${id}`, {responseType: 'arraybuffer'}).subscribe(buffer => {
      this.profilePicture = URL.createObjectURL(new Blob([buffer]));
    });
  }
}
