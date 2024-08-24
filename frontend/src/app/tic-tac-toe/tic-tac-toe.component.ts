import {booleanAttribute, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TictactoeService} from "./services/tictactoe.service";
import {ReadUserProfilePictureService} from "../services/user/readUserProfilePicture/read-user-profile-picture.service";
import {MoveDto} from "../services/user/interfaces/MoveDto";

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [],
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.css'
})
export class TicTacToeComponent implements OnInit{

  isTrainingMode: boolean = false;

  constructor(
    public tictactoeService: TictactoeService,
    public readPicture: ReadUserProfilePictureService,
    private router: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.router.queryParams.subscribe(params => {
      this.isTrainingMode = params['mode'] === 'training';
      if (this.isTrainingMode) this.setupTrainingMode();
    }))

    if (this.tictactoeService.board.length === 0){
      this.tictactoeService.loadFromApi();
    }
  }

  setupTrainingMode(){

  }

  moveMove(position: number) {
    this.tictactoeService.makeMove({position});
  }

}
