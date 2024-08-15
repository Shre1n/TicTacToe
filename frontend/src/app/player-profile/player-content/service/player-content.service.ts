import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {UserDto} from "../userDto";
import {
  ReadUserProfilePictureService
} from "../../../services/user/readUserProfilePicture/read-user-profile-picture.service";
import {ReadUserService} from "../../../services/user/readUser/read-user.service";

@Injectable({
  providedIn: 'root'
})
export class PlayerContentService {

  constructor(private http: HttpClient, private readUserService: ReadUserService) {
  }

  onUpload(file: File | null) {
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('title', 'my nice avatar');

      this.http.post<HttpResponse<any>>('/api/user/avatar', formData, {observe: 'response'}).subscribe({
        next: (response: HttpResponse<any>) => {
          switch (response.status) {
            case 201:
              alert('Erfolgreich dein Bild hochgeladen!');
              break;
            case 422:
              alert('Nicht unterstützter Dateityp!');
              break;
            default:
              alert('Unbekannter Fehler!');
          }
        },
        error: () => {
          alert('Fehler bei der Hochladung des Bildes!');
        }
      });
    } else {
      alert('Bitte wähle eine Datei aus!');
    }
  }


  readUser(): void {
    this.readUserService.readUser();
  }
}
