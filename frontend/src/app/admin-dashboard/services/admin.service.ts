import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {QueueDto} from "../interfaces/queueDto";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/api';

  matchMakingQueue: string[] = []

  constructor(private http : HttpClient) { }

  getMatchMakingQueue() {
    this.http.get<QueueDto>(`${this.apiUrl}/queue`).subscribe((queue: QueueDto) => {
      console.log(queue)
    })
  }

  getRunningGames(): Observable<{ id: number, player1: string, player2: string }[]> {
    return this.http.get<{ id: number, player1: string, player2: string }[]>(`${this.apiUrl}/games`);
  }

}
