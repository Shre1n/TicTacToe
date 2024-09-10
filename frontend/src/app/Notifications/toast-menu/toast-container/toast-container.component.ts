import {Component, OnInit} from '@angular/core';
import {Toast} from "../interfaces/toaster.interface";
import {ToastMenuComponent} from "../toast-menu.component";
import {ToastService} from "../services/toast.service";


@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [
    ToastMenuComponent
  ],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css'
})

/**
 * Container Component for Toast Manipulation
 */
export class ToastContainerComponent implements OnInit{

  /**
   * Toast Array
   */
  toasts: Toast[] = [];

  constructor(private toaster: ToastService) {}

  /**
   * Lifecycle Method
   * Subscribed toast Observable to receive Messages
   * Add Messages to Array
   * Set timeout to hide Messages
   */

  ngOnInit() {
    this.toaster.toast$
      .subscribe(toast => {
        this.toasts = [toast, ...this.toasts];
        setTimeout(() => this.toasts.pop(), toast.delay || 6);
      });
  }

  /**
   * Filter Array to remove the Message from Array
   * @param index to remove from Array
   */

  remove(index: number) {
    this.toasts = this.toasts.filter((v, i) => i !== index);
    //this.toasts.splice(index, 1);
  }
}
