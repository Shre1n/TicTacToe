import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  showQueue: boolean = false;
  showGames: boolean = false;
  matchMakingQueue: string[] = ['Player1', 'Player2']
  runningGames: {id:number, player1:string, player2:string}[]= [
    {id: 1, player1: 'Player1', player2: 'Player2'},
  ];

  toggleSidebar(){
    document.getElementById('wrapper')?.classList.toggle('toggled');
  }

  toggleQueue(){
    this.showQueue = !this.showQueue;
    this.showGames = false;
  }

  toggleGames(){
    this.showGames = !this.showGames;
    this.showQueue = false;
  }

  viewGame(gameId: number) {
    alert('Viewing game with ID: ' + gameId);
  }



}
