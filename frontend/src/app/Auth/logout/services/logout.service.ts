import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import { UserService } from '../../../User/user.service';
import { ApiEndpoints } from '../../../api-endpoints';
import { ToastService } from '../../../Notifications/toast-menu/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  constructor(private http: HttpClient, private userService: UserService, private router: Router, private toastService: ToastService) { }


  logout() {
    return this.http.delete(ApiEndpoints.AUTH, {}).subscribe({
      next: () => {
        this.userService.clear();
        window.localStorage.clear();
        window.location.reload();
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Error during logout', err);
        this.toastService.show('error', 'HTTP Error', 'Error while logging out');
      },
    });
  }

}
