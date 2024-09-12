import {Component, OnInit} from '@angular/core';
import {AdminService} from "./services/admin.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {GameDto} from "../../Game/interfaces/gamesDto";
import {NgClass, NgStyle, NgSwitch} from "@angular/common";
import {LogoutService} from "../../Auth/logout/services/logout.service";
import {UserDto} from "../../User/interfaces/userDto";
import {CurrentGamesComponent} from './current-games/current-games.component';
import {TttBoardComponent} from '../../Game/ttt-preview-board/ttt-board.component';
import {WaitingPlayersComponent} from './waiting-players/waiting-players.component';
import {GameResult} from '../../Game/interfaces/matchDto';
import {TictactoeService} from '../../Game/tic-tac-toe/services/tictactoe.service';
import {SocketService} from '../../Socket/socket.service';
import {UserListComponent} from "../user-list/user-list.component";
import {PlayerStatsComponent} from "./player-stats/player-stats.component";

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
    UserListComponent,
    PlayerStatsComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  constructor(
    public adminService: AdminService,
    private logOut: LogoutService,
    private router: Router) {
  }

  searchText: string = '';
  usernameHints: string[] = [];
  selectedGame: GameDto | null = null;
  viewUsers: boolean = false;

  highlightedIndex: number | null = null;


  ngOnInit() {
    this.adminService.getMatchMakingQueue();
    this.adminService.getRunningGames();
    this.adminService.getUsers();
  }

  updateHints() {
    this.usernameHints = this.adminService.users
      .map((x) => x.username)
      .filter((x) => x.startsWith(this.searchText))
      .slice(0, 10);
    this.highlightedIndex = null;
  }

  toggleUserView() {
    this.viewUsers = !this.viewUsers
  }

  logout() {
    this.logOut.logout();
  }

  setSearchText($event: string) {
    this.searchText = $event;
    this.viewUsers = false;
    this.onSearch();
  }

  toggleSidebars(side: string) {
    const sidebar = document.getElementById(`${side}-sidebar-wrapper`);
    const wrapper = document.getElementById('wrapper');

    if (sidebar && wrapper) {
      if (wrapper.classList.contains(`toggled-${side}`)) {
        setTimeout(() => {

          sidebar.style.display = 'none';
          wrapper.classList.remove(`toggled-${side}`);
        }, 250);
      } else {
        sidebar.style.display = 'block';
        setTimeout(() => {
          wrapper.classList.add(`toggled-${side}`);
        }, 10);
      }
    }
  }

  onFocusInEvent() {
    this.showElement("searchResults", "visible");
  }

  onFocusOutEvent(event: FocusEvent) {
    const target = event.relatedTarget as HTMLElement;
    if (target && target.closest('#searchResults')) {
      return;
    }
    this.showElement("searchResults", "hidden");
    this.highlightedIndex = null;
  }


  onResultsMouseDown(event: MouseEvent) {
    event.preventDefault();
  }


  getSearchTextFromChild($event: string) {
    this.searchText = $event;
    this.adminService.searchUsers(this.searchText);
  }


  onSearch() {
    this.adminService.searchUsers(this.searchText);
    if (this.viewUsers)
      this.viewUsers = false;
    this.usernameHints = [];
  }

  onKeyDown(event: KeyboardEvent) {

    switch (event.key) {
      case "Enter":
        if (this.highlightedIndex !== null) {
          this.searchText = this.usernameHints[this.highlightedIndex];
          this.showElement("searchResults", "hidden");
          this.highlightedIndex = null;
          this.onSearch();
          return;
        }
        break;
      case "ArrowDown":
        if (this.highlightedIndex === null) {
          this.highlightedIndex = 0;
        } else if (this.highlightedIndex < this.usernameHints.length - 1) {
          this.highlightedIndex++;
        }
        this.scrollToHighlighted();
        break;
      case "ArrowUp":
        if (this.highlightedIndex !== null && this.highlightedIndex > 0) {
          this.highlightedIndex--;
          this.scrollToHighlighted();
        }
    }
  }

  scrollToHighlighted() {
    const searchResults = document.getElementById("searchResults");
    if (searchResults && this.highlightedIndex !== null) {
      const highlightedItem = searchResults.children[this.highlightedIndex] as HTMLElement;
      if (highlightedItem) {
        highlightedItem.scrollIntoView({block: 'nearest'});
      }
    }
  }

  selectUser(username: string) {
    this.searchText = username;
    this.showElement("searchResults", "hidden");

  }


  showElement(indicator: string, showState: string) {
    const selectedUser = document.getElementById(indicator);
    if (selectedUser)
      selectedUser.style.visibility = showState;
  }


  selectGame(data: { game: GameDto, event: MouseEvent }) {
    const {game, event} = data;
    if (this.selectedGame) {
      this.selectedGame = null;
      const gameDetailsBox = document.querySelector('.game-details-box') as HTMLElement;
      if (gameDetailsBox) {
        gameDetailsBox.classList.remove('show');
      }
    } else {
      this.selectedGame = game;
    }
  }


  protected readonly GameResult = GameResult;
}
