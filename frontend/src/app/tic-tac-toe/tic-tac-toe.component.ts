import {booleanAttribute, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TictactoeService} from "./services/tictactoe.service";
import {ReadUserProfilePictureService} from "../services/user/readUserProfilePicture/read-user-profile-picture.service";
import {MoveDto} from "../services/user/interfaces/MoveDto";
import {ChatComponent} from "../Site-View/chat/chat.component";
import {ConnectService} from "../services/connect.service";

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
    public readPicture: ReadUserProfilePictureService,
    private router: ActivatedRoute,
    private connectService: ConnectService,
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

}
