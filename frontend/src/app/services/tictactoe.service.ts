import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TictactoeService {

  private readonly apiUrl = 'http://localhost:3000/game';

  constructor(private http : HttpClient) { }


  makeAMove(position:number) {
    const payload = { position };
    return this.http.put(this.apiUrl, payload);
  }


}
