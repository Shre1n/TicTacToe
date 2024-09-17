import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GameDto} from "../../../Game/interfaces/gamesDto"
import {UserDto} from '../../../User/interfaces/userDto';
import {QueueDto} from '../interfaces/queueDto';
import {ApiEndpoints} from '../../../api-endpoints';
import {ProfileDto} from '../../../User/player-profile/interfaces/profile.dto';
import {SocketService} from '../../../Socket/socket.service';
import {UserStatsDto} from '../../../User/player-profile/interfaces/user-stats.dto';
import {MatchDto} from '../../../Game/interfaces/matchDto';
import {Router} from '@angular/router';
import {ToastService} from "../../../Notifications/toast-menu/services/toast.service";
import { TictactoeService } from '../../../Game/tic-tac-toe/services/tictactoe.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  matchMakingQueue: QueueDto[] = [];

  runningGames: GameDto[] = [];

  users: UserDto[] = [];

  userGames: MatchDto[] = []

  userStats?: UserStatsDto;

  error: string = "";

  selectedUser?: string;


  constructor(
    private http: HttpClient,
    socketService: SocketService,
    private router: Router,
    private toast: ToastService,
    private tictactoeService: TictactoeService
  ) {
    socketService.onQueueUpdated().subscribe(() => {
      this.getMatchMakingQueue();
    });
    socketService.onRunningGamesUpdated().subscribe(() => {
      this.getRunningGames();
    });
  }



  getUsers() {
    this.http.get<[UserDto]>(ApiEndpoints.USER).subscribe({
      next: (response: [UserDto]) => {
        this.users = response;
      },
      error: (err: HttpErrorResponse) => {
        this.toast.show('error', "Error", "Something went wrong.");
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
        this.toast.show('error', "Error", "Something went wrong.");
        if (err.status === 403)
          this.router.navigate(['/forbidden']);
        if (err.status === 401)
          this.router.navigate(['/unauthorized']);
      }
    });
  }

  loadGame(player: string) {
    this.http.get<GameDto[]>(ApiEndpoints.GAME).subscribe((games: GameDto[]) => {
      const game = games.filter(game => game.player1.username === player || game.player2.username === player).pop();
      if (!game) return;
      this.tictactoeService.initGameBoard(game, true);

      this.getProfilePicture(game.player1.profilePictureId).subscribe((data)=> {
        if (this.tictactoeService.game)
          this.tictactoeService.game.player1.profilePictureUrl = URL.createObjectURL(new Blob([data]))
      });
      this.getProfilePicture(game.player2.profilePictureId).subscribe((data)=> {
        if (this.tictactoeService.game)
          this.tictactoeService.game.player2.profilePictureUrl = URL.createObjectURL(new Blob([data]))
      });
    });
  }

  getRunningGames(): void {
    this.http.get<GameDto[]>(ApiEndpoints.GAME).subscribe({
      next: (games: GameDto[]) => {
        this.runningGames = games;
      },
      error: (err: HttpErrorResponse) => {
        this.toast.show('error', "Error", "Something went wrong.");
        if (err.status === 403)
          this.router.navigate(['/forbidden']);
        if (err.status === 401)
          this.router.navigate(['/unauthorized']);
      }
    });
  }

  searchUsers(query: string): void {
    this.userGames = [];
    this.selectedUser = undefined;
    this.userStats = undefined;

    if (query.length > 0) {
      this.selectedUser = query;
      this.http.get<ProfileDto>(`${ApiEndpoints.USER}/${query}`).subscribe({
        next: (response: ProfileDto) => {
          this.userGames = response.matchHistory;
          this.userStats = response.stats;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Search failed:', err);
          if (err.status === 404)
            this.error = this.displayError("User not Found!");
          if (err.status === 403)
            this.router.navigate(['/forbidden']);
          if (err.status === 401)
            this.router.navigate(['/unauthorized']);
        }
      });
    }
    this.error = "";
  }

  displayError(error: string): string {
    return error
  }

  getProfilePicture(id: number) {
    return this.http.get(`${ApiEndpoints.AVATAR}/${id}`, {responseType: 'arraybuffer'});
  }
}
