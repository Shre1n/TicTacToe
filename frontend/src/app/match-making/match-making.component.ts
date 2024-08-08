import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-match-making',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './match-making.component.html',
  styleUrl: './match-making.component.css'
})
export class MatchMakingComponent implements OnInit, OnDestroy, AfterViewInit{
  timeElapsed: number = 0;
  interval: any;

  @ViewChild('yourProfile') yourProfile!: ElementRef<HTMLImageElement>;
  @ViewChild('opponentProfile') opponentProfile!: ElementRef<HTMLImageElement>;

  @ViewChild('leftSide') leftSide!: ElementRef<HTMLDivElement>;
  @ViewChild('rightSide') rightSide!: ElementRef<HTMLDivElement>;
  @ViewChild('middle') middle!: ElementRef<HTMLDivElement>;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.startTimer();
  }

  ngAfterViewInit() {
    this.opponentProfile.nativeElement.addEventListener('animationend', () => {
      this.yourProfile.nativeElement.classList.add('no-shake');
      this.unfoldSides();
      this.hideMiddleElements();
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
    this.router.navigate(['/play-now']);
    console.log('Matchmaking abgebrochen');
  }
}
