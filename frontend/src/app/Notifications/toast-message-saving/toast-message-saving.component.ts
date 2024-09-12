import {AfterViewChecked, Component} from '@angular/core';
import {ToastService} from "../toast-menu/services/toast.service";

@Component({
  selector: 'app-toast-message-saving',
  standalone: true,
  imports: [],
  templateUrl: './toast-message-saving.component.html',
  styleUrl: './toast-message-saving.component.css'
})
export class ToastMessageSavingComponent implements AfterViewChecked{

  /**
   * Value to Display Toast Savings
   */
  isToastSavingOpen: boolean = false;

  /**
   * Value to Display the Counter of unseen Messages
   */
  unreadCount: number = 0;

  /**
   *
   * @param toastService DI
   */
  constructor(public toastService: ToastService) {
  }

  /**
   * Lifecycle Method
   * Checks if View has Changed
   */

  ngAfterViewChecked() {
    this.unreadCount = this.toastService.storedToasts.filter(toast => !toast.read).length;
  }


  /**
   * Saving the Toasts in the Message Container and mark them as 'read'
   */
  toggleToastSaving() {
    this.isToastSavingOpen = !this.isToastSavingOpen;

    if (this.isToastSavingOpen)
      this.toastService.storedToasts.forEach(toast => toast.read = true);
      this.unreadCount = 0;
  }

  /**
   * Track html index for 'for'
   * @param index
   */
  trackByIndex(index: number): number {
    return index;
  }

}
