import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import { UserService } from '../../User/user.service';
import { SocketService } from '../../Socket/socket.service';
import {StatusIndikatorComponent} from "../../User/status-indikator/status-indikator.component";
import { UserDto } from '../../User/interfaces/userDto';
import { ToastService } from '../../Notifications/toast-menu/services/toast.service';

@Component({
  selector: 'app-match-making',
  standalone: true,
  imports: [
    NgOptimizedImage,
    StatusIndikatorComponent
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
    private socketService: SocketService,
    private toastService: ToastService
  ) {
  }

  ngOnInit() {
    this.startTimer();
    this.userService.getWaitingTime().subscribe(time => {
      this.timeElapsed = time / 1000;
    });
  }

  ngAfterViewInit() {
    this.socketService.onGameStarted().pipe(this.userService.profilePicturePipe()).subscribe((opponent: UserDto) => {
      this.opponent = opponent;
      setTimeout(() => {
        this.found = true;
        setTimeout(() => {
          this.yourProfile.nativeElement.classList.add('no-shake');
          this.unfoldSides();
          this.hideMiddleElements();
          setTimeout(() => {
            this.userService.setPlaying();
            this.router.navigate(['/game']);
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
    const seconds = Math.floor(this.timeElapsed % 60).toString().padStart(2, '0');
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
    this.toastService.show('success', '!', 'Matchmaking was cancelled');
  }


  back(){
    this.router.navigate(['/']);
  }

}
