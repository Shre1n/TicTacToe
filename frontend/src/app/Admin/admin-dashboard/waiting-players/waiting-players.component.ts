import {Component, OnInit} from '@angular/core';
import {AdminService} from "../services/admin.service";

@Component({
  selector: 'app-waiting-players',
  standalone: true,
  imports: [],
  templateUrl: './waiting-players.component.html',
  styleUrl: './waiting-players.component.css'
})
export class WaitingPlayersComponent implements OnInit {
  matchMakingQueue: string[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadQueue();
  }

  loadQueue(): void {
    this.adminService.getMatchMakingQueue().subscribe(queue => {
      this.matchMakingQueue = queue;
    });
  }

  toggleQueue(): void {
    // Implementiere die Logik zum Umschalten der Ansicht
  }
}
