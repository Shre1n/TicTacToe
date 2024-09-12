import {Component, Input} from '@angular/core';
import {TttBoardComponent} from "../../../../Game/ttt-preview-board/ttt-board.component";
import {GameResult} from "../../../../Game/interfaces/matchDto";
import {Router} from "@angular/router";
import {PlayerContentService} from "../service/player-content.service";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-games-info',
  standalone: true,
  imports: [
    TttBoardComponent,
    NgStyle
  ],
  templateUrl: './games-info.component.html',
  styleUrl: './games-info.component.css'
})
export class GamesInfoComponent {
  constructor(
    public playerContent : PlayerContentService,
    private router: Router) {}

  protected readonly GameResult = GameResult;
  protected readonly Math = Math;
}
