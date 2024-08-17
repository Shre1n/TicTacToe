import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {LoginService} from "../../login/services/login.service";

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) { }

  canActivate(): boolean {
    const isAdmin = this.loginService.isAdmin();

    if (isAdmin) {
      return true;
    } else {
      this.router.navigate(['/forbidden']);
      return false;
    }
  }
}
