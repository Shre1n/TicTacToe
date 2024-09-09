import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnChanges,
  OnInit, Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {NgClass, NgStyle} from "@angular/common";
import {ToastType} from "./toaster.types";
import {Toast} from "./interfaces/toaster.interface";
import {TictactoeService} from "../../Game/tic-tac-toe/services/tictactoe.service";
import {ToastService} from "./services/toast.service";

@Component({
  selector: 'app-toast-menu',
  standalone: true,
  imports: [
    NgClass,
    NgStyle
  ],
  templateUrl: './toast-menu.component.html',
  styleUrl: './toast-menu.component.css'
})
export class ToastMenuComponent implements AfterViewInit{

  @Input() toast!: Toast;
  @Input() i!: number;

  @ViewChild('toaster', { static: false }) toastElement!: ElementRef;
  @ViewChild('image', { static: false }) imageElement!: ElementRef;

  @Output() remove = new EventEmitter<number>();

  private bootstrapToast: any;
  private readonly defaultDelay = 3000;

  iconMap = new Map<string, string>([
    ['success', 'fa-solid fa-thumbs-up'],
    ['warning', 'fa-solid fa-circle-info'],
    ['error', 'fa-solid fa-circle-exclamation']
  ]);

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.toastElement) {
      if ((window as any).bootstrap && (window as any).bootstrap.Toast) {
        setTimeout(() => {
          this.bootstrapToast = new (window as any).bootstrap.Toast(this.toastElement.nativeElement, {
            delay: this.defaultDelay,
          });
          this.showToast();
          this.cdr.detectChanges();
        },2000);
      } else {
        console.error('Bootstrap JS wurde nicht korrekt geladen.');
      }
    }

  }

  showToast() {
    this.bootstrapToast.show();
  }

}
