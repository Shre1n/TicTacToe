import {Component, OnInit} from '@angular/core';
import {TictactoeService} from "./services/tictactoe.service";
import {ChatComponent} from "../chat/chat.component";

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

  constructor(
    public tictactoeService: TictactoeService,
    ) {
  }

  ngOnInit() {
    if (this.tictactoeService.board.length === 0){
      this.tictactoeService.loadFromApi();
    }
  }

  moveMove(position: number) {
    this.tictactoeService.makeMove({position});
  }

  giveUp(){
    this.tictactoeService.giveUp();
  }
}
