import {Component, OnInit} from '@angular/core';
import {TictactoeService} from "./services/tictactoe.service";
import {ChatComponent} from "../chat/chat.component";
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [
    ChatComponent,
    NgIf,
    NgClass,
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

  getIcon(cell: number) : string {
    return cell === 1 ? 'fa-solid fa-x' : cell === 2 ? 'fa-solid fa-o' : '';
  }
}
