import {Component, OnInit} from '@angular/core';
import {AdminService} from "./services/admin.service";
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
export class AdminDashboardComponent implements OnInit {

  constructor(public adminService: AdminService, private router: Router) {
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
    const rightSidebar = document.getElementById('right-sidebar-wrapper');
    const wrapper = document.getElementById('wrapper');

    if (rightSidebar && wrapper) {
      if (wrapper.classList.contains('toggled-right')) {
        rightSidebar.classList.remove('transition');
        setTimeout(() => {
          rightSidebar.classList.add('transition');
          rightSidebar.style.display = 'none';
          wrapper.classList.remove('toggled-right');
        }, 250);
      } else {

        rightSidebar.style.display = 'block';
        setTimeout(() => {
          rightSidebar.classList.add('transition');
          wrapper.classList.add('toggled-right');
        }, 10);
      }
    }
  }

  toggleQueue(){
    this.showQueue = !this.showQueue;
  }

  toggleGames(){
    this.showGames = !this.showGames;
  }

  viewGame(gameId: number) {
    alert('Viewing game with ID: ' + gameId);
  }

  getMatchMakingQueue() {
    this.adminService.getMatchMakingQueue();
  }

  getRunningGames() {
    this.adminService.getRunningGames();
  }

  onSearch() {
    console.log('Search text:', this.searchText);
    // Implement the search logic here
  }



}
