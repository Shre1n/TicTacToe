import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {UserDto} from "../userDto";

@Injectable({
  providedIn: 'root'
})
export class PlayerContentService {

  username = "";
  profilePicture = '';
  elo = 0;


  constructor(private http: HttpClient) {
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

  readProfilePicture(id: number) {
    this.http.get(`/api/user/avatar/${id}`, {responseType: 'arraybuffer'}).subscribe(buffer => {
      this.profilePicture = URL.createObjectURL(new Blob([buffer]))
    });
  }


  readUser(): void {
    this.http.get<UserDto>(`/api/user/me`).subscribe((user: UserDto): void => {
      this.username = user.username;
      this.readProfilePicture(user.profilePictureId)
      this.elo = user.elo;
    })
  }
}
