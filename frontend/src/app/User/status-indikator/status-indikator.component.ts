import { Component } from '@angular/core';
import {UserState} from "../interfaces/userDto";
import {UserService} from "../user.service";
import {Router} from "@angular/router";
import {NgClass} from "@angular/common";
import { TictactoeService } from '../../Game/tic-tac-toe/services/tictactoe.service';

@Component({
  selector: 'app-status-indikator',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './status-indikator.component.html',
  styleUrl: './status-indikator.component.css'
})
export class StatusIndikatorComponent {
  constructor(
    private router: Router,
    public userService: UserService,
    public tictactoeService: TictactoeService
  ) {}

    protected readonly UserState = UserState;

  navMatchMaking(){
    this.router.navigate(['/game']);
  }
}
