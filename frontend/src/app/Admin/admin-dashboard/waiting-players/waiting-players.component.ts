import {Component} from '@angular/core';
import {AdminService} from "../services/admin.service";

@Component({
  selector: 'app-waiting-players',
  standalone: true,
  imports: [],
  templateUrl: './waiting-players.component.html',
  styleUrl: './waiting-players.component.css'
})
export class WaitingPlayersComponent {

  constructor(public adminService: AdminService) {}

}
