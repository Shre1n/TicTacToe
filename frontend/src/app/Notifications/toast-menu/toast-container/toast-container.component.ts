import {Component, OnInit} from '@angular/core';
import {Toast} from "../interfaces/toaster.interface";
import {ToastType} from "../toaster.types";
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
export class ToastContainerComponent implements OnInit{
  toasts: Toast[] = [];

  constructor(private toaster: ToastService) {}

  ngOnInit() {
    this.toaster.toast$
      .subscribe(toast => {
        this.toasts = [toast, ...this.toasts];
        setTimeout(() => this.toasts.pop(), toast.delay || 6000);
      });
  }

  remove(index: number) {
    this.toasts = this.toasts.filter((v, i) => i !== index);
    //this.toasts.splice(index, 1);
  }
}
