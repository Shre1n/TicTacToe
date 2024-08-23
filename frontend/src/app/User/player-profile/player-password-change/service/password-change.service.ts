import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {UpdatePasswordDto} from "./update-password.dto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PasswordChangeService {

  constructor(private http: HttpClient) {
  }


  changePassword(oldPassword: string, newPassword: string) {

    this.http.put<HttpResponse<any>>('/api/user', {oldPassword: oldPassword, newPassword: newPassword}, {observe: 'response'}).subscribe({
      next: (response: HttpResponse<any>) => {
        switch (response?.status) {
          case 200:
            alert("Passwortänderung erfolgreich!");
            break;
          case 400:
            alert('Invalide Eingaben!');
            break;
          case 403:
            alert("Die Angaben ware nicht richtig!")
            break;
          default:
            alert('Ungewöhnlicher Error!');
            break;
        }
      },
      error: () => {
        alert("Fehler beim ändern des Passwortes.")
      }
    });
  }

}

