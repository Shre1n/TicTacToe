import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import { UserService } from '../../User/user.service';
import { SocketService } from '../../Socket/socket.service';
import { UserDto } from '../../User/interfaces/userDto';
import { MatchUpDto } from '../interfaces/MatchUpDto';
import { MatchMakingService } from './match-making.service';

@Component({
  selector: 'app-match-making',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './match-making.component.html',
  styleUrl: './match-making.component.css'
})
export class MatchMakingComponent implements OnInit, OnDestroy, AfterViewInit {
  timeElapsed: number = 0;
  interval: any;
  found: boolean = false;
  opponent?: UserDto;

  @ViewChild('yourProfile') yourProfile!: ElementRef<HTMLImageElement>;
  @ViewChild('opponentProfile') opponentProfile!: ElementRef<HTMLImageElement>;

  @ViewChild('leftSide') leftSide!: ElementRef<HTMLDivElement>;
  @ViewChild('rightSide') rightSide!: ElementRef<HTMLDivElement>;
  @ViewChild('middle') middle!: ElementRef<HTMLDivElement>;

  constructor(
    private router: Router,
    public userService: UserService,
    public matchMakingService: MatchMakingService,
    private socketService: SocketService
  ) {
  }

  ngOnInit() {
    this.startTimer();
  }

  ngAfterViewInit() {
    this.socketService.onGameStarted().pipe(this.matchMakingService.profilePicturePipe()).subscribe((matchUp: MatchUpDto) => {
      this.opponent = matchUp.opponent;
      setTimeout(() => {
        this.found = true;
        setTimeout(() => {
          this.yourProfile.nativeElement.classList.add('no-shake');
          this.unfoldSides();
          this.hideMiddleElements();
          setTimeout(() => {
            this.userService.setPlaying();
            this.router.navigate(['/game', matchUp.gameId]);
          }, 1000);
        }, 3000);
      }, 1000);
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.timeElapsed++;
    }, 1000);
  }


  unfoldSides() {
    this.leftSide.nativeElement.classList.add('unfold-left');
    this.rightSide.nativeElement.classList.add('unfold-right');
  }

  hideMiddleElements() {
    this.middle.nativeElement.classList.add('hide-middle');
  }


  get formattedTime(): string {
    const minutes = Math.floor(this.timeElapsed / 60).toString().padStart(2, '0');
    const seconds = (this.timeElapsed % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  cancelMatchmaking() {
    this.socketService.leaveQueue();
    this.userService.setReady();
    this.router.navigate(['']);
    console.log('Matchmaking abgebrochen');
  }
}
