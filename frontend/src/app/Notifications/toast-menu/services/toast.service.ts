import { Injectable } from '@angular/core';
import {Toast} from "../interfaces/toaster.interface";
import {ToastType} from "../toaster.types";
import {BehaviorSubject, delay, filter, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private _subject: BehaviorSubject<Toast | null>;
  readonly toast$: Observable<Toast>;



  constructor() {
    this._subject = new BehaviorSubject<Toast | null>(null);
    this.toast$ = this._subject.asObservable()
      .pipe(filter(toast => toast !== null));
  }

  show(type: ToastType,title: string, body: string, delay?: number) {
    this._subject.next({ type, title, body, delay});
  }
}
