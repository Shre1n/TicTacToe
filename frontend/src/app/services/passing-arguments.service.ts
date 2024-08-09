import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Socket } from 'ngx-socket-io';
import {Observable} from "rxjs";
import {ConnectService} from "./connect.service";

@Injectable({
  providedIn: 'root'
})
export class PassingArgumentsService {

  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http : HttpClient, private connectService: ConnectService) { }


}
