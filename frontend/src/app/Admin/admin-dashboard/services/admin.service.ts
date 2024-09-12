import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {GameDto} from "../../../Game/interfaces/gamesDto"
import {UserDto} from '../../../User/interfaces/userDto';
import { QueueDto } from '../interfaces/queueDto';
import { ApiEndpoints } from '../../../api-endpoints';
import { ProfileDto } from '../../../User/player-profile/interfaces/profile.dto';
import { SocketService } from '../../../Socket/socket.service';
import { UserStatsDto } from '../../../User/player-profile/interfaces/user-stats.dto';
import { MatchDto } from '../../../Game/interfaces/matchDto';
import { Router } from '@angular/router';

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
    socketService: SocketService,
    private router: Router,
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
      error: (err: HttpErrorResponse)=> {
        console.error(err);
        if (err.status === 403)
          this.router.navigate(['/forbidden']);
        if (err.status === 401)
          this.router.navigate(['/unauthorized']);
    }
    });
  }

  getMatchMakingQueue() {
    this.http.get<{ queueEntries: QueueDto[] }>(ApiEndpoints.QUEUE).subscribe({
      next: (queue: { queueEntries: QueueDto[] }) => {
        this.matchMakingQueue = queue.queueEntries;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch queue:', err);
        if (err.status === 403)
          this.router.navigate(['/forbidden']);
        if (err.status === 401)
          this.router.navigate(['/unauthorized']);
      }
    });
  }

  getRunningGames(): void {
    this.http.get<GameDto[]>(ApiEndpoints.GAME).subscribe({
      next: (games: GameDto[]) => {
        this.runningGames = games;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch games:', err);
        if (err.status === 403)
          this.router.navigate(['/forbidden']);
        if (err.status === 401)
          this.router.navigate(['/unauthorized']);
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
          error: (err: HttpErrorResponse) => {
            console.error('Search failed:', err);
            if (err.status === 403)
              this.router.navigate(['/forbidden']);
            if (err.status === 401)
              this.router.navigate(['/unauthorized']);
          }
        });
    }
  }

  getProfilePicture(id: number) {
    return this.http.get(`${ApiEndpoints.AVATAR}/${id}`, {responseType: 'arraybuffer'});
  }
}
