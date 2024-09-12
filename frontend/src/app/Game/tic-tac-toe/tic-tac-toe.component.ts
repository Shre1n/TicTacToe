import {Component, OnInit} from '@angular/core';
import {TictactoeService} from "./services/tictactoe.service";
import {ChatComponent} from "../chat/chat.component";
import { NgClass, NgIf } from '@angular/common';
import {Router} from "@angular/router";

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
    private router: Router,
    ) {
  }

  ngOnInit() {
    this.tictactoeService.loadFromApi();
  }

  moveMove(position: number) {
    this.tictactoeService.makeMove({position});
  }

  getIcon(cell: number) : string {
    return cell === 1 ? 'fa-solid fa-x' : cell === 2 ? 'fa-solid fa-o' : '';
  }

  giveUp(){
    const confirmed = confirm('Are you sure you want to give up the game?');
    if (confirmed) {
      this.tictactoeService.giveUp();
    }
  }

  showModal = false;

  // Open the modal
  openGiveUpModal() {
    this.showModal = true;
  }

  // Close the modal
  closeGiveUpModal() {
    this.showModal = false;
  }

  // Confirm give up
  confirmGiveUp() {
    this.tictactoeService.giveUp();
    this.closeGiveUpModal();
  }

  back(){
    this.router.navigate(['/']);
  }
}
