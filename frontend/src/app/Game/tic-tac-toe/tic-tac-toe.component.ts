import {Component, OnInit} from '@angular/core';
import {TictactoeService} from "./services/tictactoe.service";
import {ChatComponent} from "../chat/chat.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [
    ChatComponent
  ],
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.css'
})
export class TicTacToeComponent implements OnInit{
  public id: number = 0;
  constructor(public tictactoeService: TictactoeService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.tictactoeService.loadFromApi(this.id);
  }

  moveMove(position: number) {
    this.tictactoeService.makeMove({id: this.id ,position});
  }

}
