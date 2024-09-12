import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import { ApiEndpoints } from '../../../../api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class PasswordChangeService {

  constructor(private http: HttpClient) {
  }


  changePassword(oldPassword: string, newPassword: string) {

    this.http.put(ApiEndpoints.ME, {oldPassword: oldPassword, newPassword: newPassword}).subscribe({
      next: () => {
        alert("Password change successful!");
      },
      error: (err: HttpErrorResponse) => {
        switch (err.status) {
          case 400:
            alert('Invalid entries!');
            break;
          case 403:
            alert("The information was incorrect!")
            break;
          default:
            alert('Unusual error!');
            break;
        }
      }
    });
  }

}

