import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/admin';

  constructor(private http : HttpClient) { }

  getMatchMakingQueue(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/queue`);
  }

  getRunningGames(): Observable<{ id: number, player1: string, player2: string }[]> {
    return this.http.get<{ id: number, player1: string, player2: string }[]>(`${this.apiUrl}/games`);
  }

}
