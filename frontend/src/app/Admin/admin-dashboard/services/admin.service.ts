import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {QueueDto} from "../interfaces/Queue/queueDto";
import {LoginService} from "../../../Auth/login/services/login.service";
import {QueueEntry} from "../interfaces/Queue/queueEntry";
import {Router} from "@angular/router";
import {ReadUserService} from "../../../services/user/readUser/read-user.service";
import {GameDto} from "../interfaces/Game/gamesDto"
import {UserDto} from "../interfaces/Game/User/userDto";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/api';

  matchMakingQueue: QueueEntry | undefined;

  runningGames: GameDto[] | undefined;

  user: UserDto[] = [];

  userGames: GameDto[] = []


  constructor(
    private http : HttpClient,
    private loginService: LoginService,
    private router: Router,
    private readUserService: ReadUserService
  ) { }


  getUsers(){
    this.http.get<[UserDto]>(`${this.apiUrl}/user`).subscribe({
      next: (response: [UserDto]) => {
        this.user = response;
      },
      error: (err)=> {
        console.log(err);
    }
    });
  }

  getMatchMakingQueue() {
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
      this.http.get<[GameDto]>(`${this.apiUrl}/user/${query}`).subscribe({
          next: (response: [GameDto]) => {
            this.userGames = response;
          },
          error: (err) => {
            console.error('Search failed:', err);
          }
        });
    }
  }
}
