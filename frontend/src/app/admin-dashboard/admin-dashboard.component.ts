import { Component } from '@angular/core';
import {AdminService} from "../services/admin.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  constructor(private adminService: AdminService, private router: Router) {
  }

  searchText: string = '';

  showQueue: boolean = false;
  showGames: boolean = false;
  matchMakingQueue: string[] = []
  runningGames: {id:number, player1:string, player2:string}[]= [];

  ngOnInit() {
    this.getMatchMakingQueue();
    this.getRunningGames();
  }

  toggleLeftSidebar() {
    document.getElementById('wrapper')?.classList.toggle('toggled-left');
  }

  toggleRightSidebar() {
    document.getElementById('wrapper')?.classList.toggle('toggled-right');
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

  getMatchMakingQueue() {
    this.adminService.getMatchMakingQueue().subscribe((queue: string[]) => {
      this.matchMakingQueue = queue;
    });
  }

  getRunningGames() {
    this.adminService.getRunningGames().subscribe((games: { id: number, player1: string, player2: string }[]) => {
      this.runningGames = games;
    });
  }

  onSearch() {
    console.log('Search text:', this.searchText);
    // Implement the search logic here
  }



}
