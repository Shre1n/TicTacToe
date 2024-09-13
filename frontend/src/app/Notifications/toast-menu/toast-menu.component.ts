import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {NgClass, NgStyle} from "@angular/common";
import {Toast} from "./interfaces/toaster.interface";
import {ToastService} from "./services/toast.service";
import {delay} from "rxjs";

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

  /**
   *
   */
  @Input() toast!: Toast;
  @Input() i!: number;

  /**
   * Observe the html Elements for changes
   * static prevents the initialisation before html is loaded
   */
  @ViewChild('toaster', { static: false }) toastElement!: ElementRef;
  @ViewChild('image', { static: false }) imageElement!: ElementRef;

  /**
   * Sends remove to Parent Component (Toast) for removing Toast Elements
   */

  @Output() remove = new EventEmitter<number>();

  /**
   * Bootstrap instance to call window operations
   * @private
   */
  private bootstrapToast: any;

  /**
   * Mapping Toaster Types of Message to fontawesome Icon
   */
  iconMap = new Map<string, string>([
    ['success', 'fa-solid fa-thumbs-up'],
    ['warning', 'fa-solid fa-circle-info'],
    ['error', 'fa-solid fa-circle-exclamation']
  ]);

  /**
   *
   * @param toaster
   */
  constructor(private toaster: ToastService) {}

  /**
   * Calls Lifecycle Method after View Initialized
   * Sets the Observed value in HTML Context as native Element to show Toast with specified Delay
   *
   */
  ngAfterViewInit(): void {
    if (this.toastElement) {
      if ((window as any).bootstrap && (window as any).bootstrap.Toast) {
          this.bootstrapToast = new (window as any).bootstrap.Toast(this.toastElement.nativeElement, {
            delay: this.toaster._subject.value?.delay,
          });
          this.showToast();
      } else {
        console.error('Bootstrap JS wurde nicht korrekt geladen.');
      }
    }

  }

  /**
   * Method to show Toast
   */

  showToast() {
    this.bootstrapToast.show();
  }

}
