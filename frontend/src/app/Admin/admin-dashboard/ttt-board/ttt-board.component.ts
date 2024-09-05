import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ttt-board',
  standalone: true,
  imports: [],
  templateUrl: './ttt-board.component.html',
  styleUrl: './ttt-board.component.css'
})
export class TttBoardComponent {
  @Input() board: number[] = [0,0,0,0,0,0,0,0,0];
  @Input() playerIdentity: 1 | 2 = 1;
}
