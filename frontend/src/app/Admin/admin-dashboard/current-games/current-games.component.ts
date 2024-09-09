import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {AdminService} from "../services/admin.service";
import { GameDto } from '../../../Game/interfaces/gamesDto';

@Component({
  selector: 'app-current-games',
  standalone: true,
  imports: [],
  templateUrl: './current-games.component.html',
  styleUrl: './current-games.component.css'
})
export class CurrentGamesComponent {
  @Output() onGameSelected = new EventEmitter<{ game: GameDto, event: MouseEvent }>();

  constructor(public adminService: AdminService) {}


  viewGame(gameId: number): void {
    // Implementiere die Logik zum Anzeigen des Spiels
    console.log('View game with ID:', gameId);
  }

  selectGame(game: GameDto, event: MouseEvent){
    this.onGameSelected.emit({game, event});
  }
}
