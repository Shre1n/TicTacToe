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
export class ToastMenuComponent implements AfterViewInit, OnChanges{

  @Input() toast!: Toast;
  @Input() i!: number;
  toastTypes: ToastType = 'success';

  @ViewChild('toaster', { static: false }) toastElement!: ElementRef;
  @ViewChild('image', { static: false }) imageElement!: ElementRef;

  @Output() remove = new EventEmitter<number>();

  private bootstrapToast: any;
  private readonly defaultDelay = 3000;
  backgroundColor: string = '#28a745'; // Default to green

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

  ngOnChanges(changes: SimpleChanges){
    if (changes['type']) {
      this.updateToastType();
    }
  }

  showToast() {
    this.bootstrapToast.show();
  }

  private updateToastType() {
    switch (this.toastTypes) {
      case 'success':
        this.backgroundColor = '#28a745'; // Green
        break;
      case 'warning':
        this.backgroundColor = '#ffc107'; // Yellow
        break;
      case 'error':
        this.backgroundColor = '#dc3545'; // Red
        break;
      default:
        this.backgroundColor = '#343a40'; // Default color
    }
  }



}
