import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GameDto} from "../../../Game/interfaces/gamesDto"
import {UserDto} from '../../../User/interfaces/userDto';
import { QueueDto } from '../interfaces/queueDto';
import { ApiEndpoints } from '../../../api-endpoints';
import { ProfileDto } from '../../../User/player-profile/interfaces/profile.dto';
import { SocketService } from '../../../Socket/socket.service';
import { UserStatsDto } from '../../../User/player-profile/interfaces/user-stats.dto';
import { MatchDto } from '../../../Game/interfaces/matchDto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  matchMakingQueue: QueueDto[] = [];

  runningGames: GameDto[] = [];

  users: UserDto[] = [];

  userGames: MatchDto[] = []

  userStats?: UserStatsDto;


  constructor(
    private http : HttpClient,
    private socketService: SocketService,
  ) {
    socketService.onQueueUpdated().subscribe(() => {
      this.getMatchMakingQueue();
    });
    socketService.onRunningGamesUpdated().subscribe(() => {
      this.getRunningGames();
    });
  }


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
      this.http.get<ProfileDto>(`${ApiEndpoints.USER}/${query}`).subscribe({
          next: (response: ProfileDto) => {
            this.userGames = response.matchHistory;
            this.userStats = response.stats;
          },
          error: (err) => {
            console.error('Search failed:', err);
          }
        });
    }
  }
}
