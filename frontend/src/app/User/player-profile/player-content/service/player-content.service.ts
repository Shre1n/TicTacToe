import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PlayerContentService {

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
}
