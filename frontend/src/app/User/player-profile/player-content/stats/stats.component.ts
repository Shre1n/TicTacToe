import { Component } from '@angular/core';
import {PlayerContentService} from "../service/player-content.service";
import {Router} from "@angular/router";
import {GameResult} from "../../../../Game/interfaces/matchDto";


@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {

  constructor(
    public playerContent : PlayerContentService,
    private router: Router) {}

  protected readonly GameResult = GameResult;
}
