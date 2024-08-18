import {Component, OnInit} from '@angular/core';
import {AdminService} from "../services/admin.service";

@Component({
  selector: 'app-current-games',
  standalone: true,
  imports: [],
  templateUrl: './current-games.component.html',
  styleUrl: './current-games.component.css'
})
export class CurrentGamesComponent implements OnInit {
  runningGames: { id: number; player1: string; player2: string }[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.adminService.getRunningGames().subscribe(games => {
      this.runningGames = games;
    });
  }

  viewGame(gameId: number): void {
    // Implementiere die Logik zum Anzeigen des Spiels
    console.log('View game with ID:', gameId);
  }

  toggleGames(): void {
    // Implementiere die Logik zum Umschalten der Ansicht
  }
}
