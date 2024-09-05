import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GameDto} from "../../../Game/interfaces/gamesDto"
import {UserDto} from '../../../User/interfaces/userDto';
import { QueueDto } from '../interfaces/queueDto';
import { ApiEndpoints } from '../../../api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  matchMakingQueue: QueueDto[] = [];

  runningGames: GameDto[] = [];

  users: UserDto[] = [];

  userGames: GameDto[] = []


  constructor(
    private http : HttpClient,
  ) { }


  getUsers(){
    this.http.get<[UserDto]>(ApiEndpoints.USER).subscribe({
      next: (response: [UserDto]) => {
        this.users = response;
      },
      error: (err)=> {
        console.error(err);
    }
    });
  }

  getMatchMakingQueue() {
    this.http.get<{ queueEntries: QueueDto[] }>(ApiEndpoints.QUEUE).subscribe({
      next: (queue: { queueEntries: QueueDto[] }) => {
        this.matchMakingQueue = queue.queueEntries;
      },
      error: (err) => {
        console.error('Failed to fetch queue:', err);
      }
    });
  }

  getRunningGames(): void {
    this.http.get<GameDto[]>(ApiEndpoints.GAME).subscribe({
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
      this.http.get<[GameDto]>(`${ApiEndpoints.USER}/${query}/game`).subscribe({
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
