import { Injectable } from '@angular/core';
import {TictactoeService} from "../../../tic-tac-toe/services/tictactoe.service";
import {ReadUserService} from "../../../services/user/readUser/read-user.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PlayNowService {

  isGame: boolean = false;

  constructor(
    private tictactoeService: TictactoeService,
    public readUser: ReadUserService,
    private router: Router
  ) { }
}
