import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import {
  ReadUserProfilePictureService
} from "../../services/user/readUserProfilePicture/read-user-profile-picture.service";
import {TictactoeService} from "../../tic-tac-toe/services/tictactoe.service";
import {MatchMakingService} from "./services/match-making.service";
import {ReadUserService} from "../../services/user/readUser/read-user.service";
import {ConnectService} from "../../services/connect.service";

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

  @ViewChild('yourProfile') yourProfile!: ElementRef<HTMLImageElement>;
  @ViewChild('opponentProfile') opponentProfile!: ElementRef<HTMLImageElement>;

  @ViewChild('leftSide') leftSide!: ElementRef<HTMLDivElement>;
  @ViewChild('rightSide') rightSide!: ElementRef<HTMLDivElement>;
  @ViewChild('middle') middle!: ElementRef<HTMLDivElement>;

  constructor(
    private router: Router,
    public readUser: ReadUserService,
    public tictactoeService: TictactoeService,
    public matchmakingService: MatchMakingService,
    public readProfile: ReadUserProfilePictureService,
    private connectService: ConnectService
  ) {
  }

  ngOnInit() {
    this.startTimer();
    this.readUser.readUser();
  }

  ngAfterViewInit() {
    this.matchmakingService.currenFoundStatus.subscribe(status => {
      if (status) {
        this.found = true;
        setTimeout(() => {
          this.yourProfile.nativeElement.classList.add('no-shake');
          this.unfoldSides();
          this.hideMiddleElements();
          setTimeout(() => {
            this.router.navigate(['/tictactoe']);
          }, 1000);
        }, 3000);
      }
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
    this.connectService.leaveQueue();
    this.router.navigate(['/play-now']);
    console.log('Matchmaking abgebrochen');
  }
}
