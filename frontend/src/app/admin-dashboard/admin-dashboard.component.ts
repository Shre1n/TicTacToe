import {Component, OnInit} from '@angular/core';
import {AdminService} from "./services/admin.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {GameDto} from "./interfaces/Game/gamesDto";
import {UserDto} from "./interfaces/Game/User/userDto";
import {NgClass, NgStyle, NgSwitch} from "@angular/common";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    NgStyle,
    NgClass,
    NgSwitch
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  constructor(public adminService: AdminService, private router: Router) {}

  searchText: string = '';
  showQueue: boolean = false;
  showGames: boolean = false;
  boxPosition = { top: 0, left: 0 };
  selectedGame: GameDto | null = null;


  ngOnInit() {
    this.getMatchMakingQueue();
    this.getRunningGames();
  }

  toggleLeftSidebar() {
    const wrapper = document.getElementById('wrapper');
    const gameDetailsBox = document.querySelector('.game-details-box') as HTMLElement;

    if (wrapper) {
      wrapper.classList.toggle('toggled-left');

      // Hide the game details box when the sidebar is toggled
      if (gameDetailsBox) {
        gameDetailsBox.classList.remove('show');
        this.selectedGame = null;
      }
    }
  }

  //todo: style it properly. Similar to the left sided translation

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

  getMatchMakingQueue() {
    this.adminService.getMatchMakingQueue();
  }

  getRunningGames() {
    this.adminService.getRunningGames();
  }

  onSearch() {
    this.adminService.searchUsers(this.searchText);
  }

  selectUser(username: string) {
    this.searchText = username;
    this.adminService.searchResults = [];
  }

  inspectPlayer(player: UserDto) {
    this.searchText = player.username;
    console.log(this.searchText);
    this.onSearch();
  }

  selectGame(game: any, event: MouseEvent) {
    if (this.selectedGame && this.selectedGame.gameId === game.id) {
      this.selectedGame = null;
      const gameDetailsBox = document.querySelector('.game-details-box') as HTMLElement;
      if (gameDetailsBox) {
        gameDetailsBox.classList.remove('show');
      }
    } else {
      // Select a new game
      this.selectedGame = game;
      setTimeout(() => this.setPosition(event), 0); // Ensure position is set after view update
    }
  }

  setPosition(event: MouseEvent) {
    const listItem = event.target as HTMLElement;
    const rect = listItem?.getBoundingClientRect();
    const gameDetailsBox = document.querySelector('.game-details-box') as HTMLElement;

    if (gameDetailsBox) {
      this.boxPosition.top = rect.top + window.scrollY;
      this.boxPosition.left = rect.left + window.scrollX + listItem.offsetWidth + 10;
      gameDetailsBox.style.top = `${this.boxPosition.top}px`;
      gameDetailsBox.style.left = `${this.boxPosition.left}px`;
      gameDetailsBox.classList.add('show');
    } else {
      console.error('List item or game details box not found');
    }
  }


}
