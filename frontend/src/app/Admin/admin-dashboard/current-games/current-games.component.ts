import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {AdminService} from "../services/admin.service";
import { GameDto } from '../../../Game/interfaces/gamesDto';
import {DatePipe, NgClass} from "@angular/common";
import {TictactoeService} from "../../../Game/tic-tac-toe/services/tictactoe.service";
import {SocketService} from "../../../Socket/socket.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-current-games',
  standalone: true,
  imports: [
    NgClass,
    DatePipe
  ],
  templateUrl: './current-games.component.html',
  styleUrl: './current-games.component.css'
})
export class CurrentGamesComponent {

  selectedGame: GameDto | null = null;

  @Output() userSelected: EventEmitter<string> = new EventEmitter();

  @Output() onGameSelected = new EventEmitter<{ game: GameDto, event: MouseEvent }>();

  constructor(public adminService: AdminService,
              private tictactoeservice: TictactoeService,
              private socketService: SocketService,
              private router: Router,) {}


  selectPlayer(user: string){
    this.userSelected.emit(user);
  }



  selectGame(game: GameDto, event: MouseEvent) {
    if (this.selectedGame === game) {
      this.selectedGame = null;
    } else {
      this.selectedGame = game; // Spiel auswählen
      this.onGameSelected.emit({game, event});
    }
  }

  spectateGame(game: GameDto){
    this.tictactoeservice.initGameBoard(game, true);
    this.socketService.enterSpectate(game.player1.username);
    this.adminService.getProfilePicture(game.player1.profilePictureId).subscribe((data)=> {
      if (this.tictactoeservice.game?.player1){
        this.tictactoeservice.game.player1.profilePictureUrl = URL.createObjectURL(new Blob([data]))
      }
    } )
    this.adminService.getProfilePicture(game.player2.profilePictureId).subscribe((data)=> {
      if (this.tictactoeservice.game?.player2){
        this.tictactoeservice.game.player2.profilePictureUrl = URL.createObjectURL(new Blob([data]))
      }
    } )
    this.router.navigate(['/spectate']);
  }
}
