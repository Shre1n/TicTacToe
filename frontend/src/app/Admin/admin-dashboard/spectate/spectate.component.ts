import { Component, OnInit } from '@angular/core';
import { TictactoeService } from '../../../Game/tic-tac-toe/services/tictactoe.service';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { SocketService } from '../../../Socket/socket.service';

@Component({
  selector: 'app-spectate',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
  ],
  templateUrl: './spectate.component.html',
  styleUrl: './spectate.component.css'
})
export class SpectateComponent implements OnInit {

  constructor(
    public tictactoeService: TictactoeService,
    private router: Router,
    private socketService: SocketService,
  ) {
  }

  getIcon(cell: number) : string {
    return cell === 1 ? 'fa-solid fa-x' : cell === 2 ? 'fa-solid fa-o' : '';
  }

  back(){
    if (this.tictactoeService.game) {
      this.socketService.leaveSpectate(this.tictactoeService.game?.player1.username)
    }
    this.router.navigate(['/admin']);
  }

  ngOnInit(): void {
    if (this.tictactoeService.game === undefined) {
      this.router.navigate(['/admin'])
    }
  }
}

