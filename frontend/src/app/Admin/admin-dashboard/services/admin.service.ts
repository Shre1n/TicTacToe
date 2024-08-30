import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GameDto} from "../../../Game/interfaces/gamesDto"
import {UserDto} from '../../../User/interfaces/userDto';
import { QueueDto } from '../interfaces/queueDto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/api';

  matchMakingQueue?: QueueDto[];

  runningGames?: GameDto[];

  user: UserDto[] = [];

  userGames: GameDto[] = []


  constructor(
    private http : HttpClient,
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
    this.http.get<QueueDto[]>(`${this.apiUrl}/queue`).subscribe({
      next: (queue: QueueDto[]) => {
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
