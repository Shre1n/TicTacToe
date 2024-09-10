import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import { ApiEndpoints } from '../../../../api-endpoints';
import {ProfileDto} from "../../interfaces/profile.dto";
import {UserStatsDto} from "../../interfaces/user-stats.dto";
import {MatchDto} from "../../../../Game/interfaces/matchDto";

@Injectable({
  providedIn: 'root'
})
export class PlayerContentService {

  public stats?: UserStatsDto
  public matchhistory: MatchDto[] = []

  constructor(private http: HttpClient) {
  }

  onUpload(file: File | null) {
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('title', 'my nice avatar');

      this.http.post<HttpResponse<any>>(ApiEndpoints.USERAVATAR, formData, {observe: 'response'}).subscribe({
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

  getinfo(){
    this.http.get<ProfileDto>(ApiEndpoints.USERPROFILE).subscribe({
     next: (response: ProfileDto) => {
       this.stats = response.stats;
       this.matchhistory = response.matchHistory;
     },
      error: (err: HttpErrorResponse) => {
       console.error(err);
      }
    })
  }
}
