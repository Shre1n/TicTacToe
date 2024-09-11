import {Component, OnInit} from '@angular/core';
import {AdminService} from "./services/admin.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {GameDto} from "../../Game/interfaces/gamesDto";
import {NgClass, NgStyle, NgSwitch} from "@angular/common";
import {LogoutService} from "../../Auth/logout/services/logout.service";
import {UserDto} from "../../User/interfaces/userDto";
import { CurrentGamesComponent } from './current-games/current-games.component';
import { TttBoardComponent } from '../../Game/ttt-preview-board/ttt-board.component';
import { WaitingPlayersComponent } from './waiting-players/waiting-players.component';
import { GameResult } from '../../Game/interfaces/matchDto';
import {transition} from "@angular/animations";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    NgStyle,
    NgClass,
    NgSwitch,
    CurrentGamesComponent,
    TttBoardComponent,
    WaitingPlayersComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  constructor(
    public adminService: AdminService,
    private logOut: LogoutService,
    private router: Router) {}

  searchText: string = '';
  boxPosition = { top: 0, left: 0 };
  usernameHints: string[] = [];
  selectedGame: GameDto | null = null;
  userToInspect: string = "";


  ngOnInit() {
    this.adminService.getMatchMakingQueue();
    this.adminService.getRunningGames();
    this.adminService.getUsers();
  }

  updateHints() {
    this.usernameHints = this.adminService.users
        .map((x) => x.username)
        .filter((x) => x.startsWith(this.searchText))
        .slice(0,10);
  }

  logout(){
    this.logOut.logout();
  }

  toggleLeftSidebar() {
    const leftSidebar = document.getElementById('left-sidebar-wrapper');
    const wrapper = document.getElementById('wrapper');

    if (leftSidebar && wrapper) {
      if (wrapper.classList.contains('toggled-left')) {
        setTimeout(() => {

          leftSidebar.style.display = 'none';
          wrapper.classList.remove('toggled-left');
        }, 250);
      } else {
        leftSidebar.style.display = 'block';
        setTimeout(() => {
          wrapper.classList.add('toggled-left');
        }, 10);
      }
    }
  }

  spectateGame(player: UserDto){
    //todo: logik machen
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

  onSearch() {
    this.adminService.searchUsers(this.searchText);
    this.userToInspect = "Games from " + this.searchText;
    this.usernameHints = [];
  }

  selectUser(username: string) {
    this.searchText = username;
  }

  inspectPlayer(player: UserDto) {
    this.searchText = player.username;
    console.log(this.searchText);
    this.onSearch();
  }

  selectGame(data: {game: GameDto, event: MouseEvent}) {
    const {game, event} = data;
    if (this.selectedGame) {
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


  protected readonly GameResult = GameResult;
}
