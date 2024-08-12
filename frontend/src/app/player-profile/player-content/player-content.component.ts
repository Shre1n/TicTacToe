import { Component } from '@angular/core';

@Component({
  selector: 'app-player-content',
  standalone: true,
  imports: [],
  templateUrl: './player-content.component.html',
  styleUrl: './player-content.component.css'
})
export class PlayerContentComponent {

  yourElo = 0;
  name = "XYZ"

}
