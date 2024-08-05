import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PassingArgumentsService {

  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http : HttpClient) { }


  getCurrentUsername(): Observable<{ username: string }> {
    return this.http.get<{ username: string }>(`${this.apiUrl}/username`);
  }

}
