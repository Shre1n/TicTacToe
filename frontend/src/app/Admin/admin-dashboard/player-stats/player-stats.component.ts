import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit
} from '@angular/core';
import {GameResult} from "../../../Game/interfaces/matchDto";
import {TttBoardComponent} from "../../../Game/ttt-preview-board/ttt-board.component";
import {AdminService} from "../services/admin.service";

@Component({
  selector: 'app-player-stats',
  standalone: true,
  imports: [
    TttBoardComponent
  ],
  templateUrl: './player-stats.component.html',
  styleUrl: './player-stats.component.css'
})
export class PlayerStatsComponent{



  constructor(protected adminService: AdminService,) {
  }



  protected readonly GameResult = GameResult;


}
