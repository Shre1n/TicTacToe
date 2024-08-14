import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {PasswordChangeService} from "./service/password-change.service";


@Component({
  selector: 'app-player-password-change',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './player-password-change.component.html',
  styleUrl: './player-password-change.component.css'
})
export class PlayerPasswordChangeComponent {

  currentPassword: string = '';
  newPassword: string = '';
  repeatPassword: string = '';

  errors = new Map<string, string>();

  constructor(private updatePass: PasswordChangeService) {
  }

  @ViewChild('currentPass')
  private currentPass!: any;
  @ViewChild('newPass')
  private newPass!: any;
  @ViewChild('repeatPass')
  private repeatPass!: any;

  submitChange() {
    this.errors.clear();

    if (this.currentPassword.trim() === '') {
      this.errors.set('currentPass', "Bitte aktuelles Passwort eingeben.");
    }

    if (this.newPassword === '') {
      this.errors.set('newPass', "Bitte ein neues Passwort eingeben.");
    }

    if (this.newPassword !== this.repeatPassword) {
      this.errors.set('repeatPass', "Die Passwörter stimmen nicht überein!");
    }

    if (this.errors.size === 0) {
      console.log(this.currentPassword, this.newPassword);
      this.updatePass.changePassword(this.currentPassword, this.newPassword);
      console.log('Passwortänderung erfolgreich!');
    }
  }
}
