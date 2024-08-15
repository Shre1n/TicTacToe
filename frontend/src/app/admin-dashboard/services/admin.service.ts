import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {QueueDto} from "../interfaces/queueDto";
import {LoginService} from "../../login/services/login.service";
import {QueueEntry} from "../interfaces/queueEntry";
import {Router} from "@angular/router";
import {ReadUserService} from "../../services/user/readUser/read-user.service";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/api';

  matchMakingQueue: QueueEntry | undefined

  constructor(private http : HttpClient, private loginService: LoginService, private router: Router, private readUserService: ReadUserService) { }

  getMatchMakingQueue() {
    if (!this.loginService.isAdmin()) {
      console.error('User is not an admin!');
      return;
    }
    this.http.get<QueueEntry>(`${this.apiUrl}/queue`).subscribe({
      next: (queue: QueueEntry) => {
        this.matchMakingQueue = queue;
      },
      error: (err) => {
        console.error('Failed to fetch queue:', err);
      }
    });
  }

  getRunningGames(): Observable<{ id: number, player1: string, player2: string }[]> {
    return this.http.get<{ id: number, player1: string, player2: string }[]>(`${this.apiUrl}/games`, {});
  }

}
