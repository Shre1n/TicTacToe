import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MatchMakingService {

  private foundAsObservable = new BehaviorSubject<boolean>(false);
  currenFoundStatus = this.foundAsObservable.asObservable();

  constructor() { }

  changeFoundStatus(){
    this.foundAsObservable.next(true);
  }
}
