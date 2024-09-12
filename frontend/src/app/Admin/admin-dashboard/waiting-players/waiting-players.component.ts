import {Component} from '@angular/core';
import {AdminService} from "../services/admin.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-waiting-players',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './waiting-players.component.html',
  styleUrl: './waiting-players.component.css'
})
export class WaitingPlayersComponent {

  constructor(public adminService: AdminService) {}

  protected readonly Math = Math;
}
