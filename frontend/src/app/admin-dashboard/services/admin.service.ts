import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {QueueDto} from "../interfaces/Queue/queueDto";
import {LoginService} from "../../login/services/login.service";
import {QueueEntry} from "../interfaces/Queue/queueEntry";
import {Router} from "@angular/router";
import {ReadUserService} from "../../services/user/readUser/read-user.service";
import {GameDto} from "../interfaces/Game/gamesDto"
import {UserDto} from "../interfaces/Game/User/userDto";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/api';

  matchMakingQueue: QueueEntry | undefined;

  runningGames: GameDto[] | undefined;

  searchResults: string[] = [];

  //todo: make it false after search and then set it true again
  showSearchResults: boolean = true;

  userDetails: { username: string, games: GameDto[] } | null = null;

  constructor(
    private http : HttpClient,
    private loginService: LoginService,
    private router: Router,
    private readUserService: ReadUserService
  ) { }

  getMatchMakingQueue() {
    if (!this.loginService.isAdmin()) {
      console.error('User is not an admin!');
      return;
    }
    this.http.get<QueueEntry>(`${this.apiUrl}/queue`).subscribe({
      next: (queue: QueueEntry) => {
        this.matchMakingQueue = queue;
      },
      error: (err) => {
        console.error('Failed to fetch queue:', err);
      }
    });
  }

  getRunningGames() {
    if (!this.loginService.isAdmin()) {
      console.error('User is not an admin!');
      return;
    }
    this.http.get<GameDto[]>(`${this.apiUrl}/game/running`).subscribe({
      next: (games: GameDto[]) => {
        this.runningGames = games;
      },
      error: (err) => {
        console.error('Failed to fetch games:', err);
      }
    });
  }

  searchUsers(query: string): void {
    if (query.length > 0) {
      this.http.get<{ username: string, games: GameDto[] }>(`${this.apiUrl}/user/search`, { params: { query } })
        .subscribe({
          next: (results: { username: string, games: GameDto[] }) => {
            this.searchResults = [results.username];
            this.userDetails = results;
            console.log(this.userDetails.games);
            this.showSearchResults = this.userDetails !== null;
          },
          error: (err) => {
            console.error('Search failed:', err);
            this.userDetails = null;
            this.searchResults = [];
            this.showSearchResults = false;
          }
        });
    } else {
      this.searchResults = [];
      this.showSearchResults = false;
    }
  }





}
