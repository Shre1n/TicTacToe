import {Component, EventEmitter, Output} from '@angular/core';
import {PlayerContentComponent} from "../player-content/player-content.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [
    PlayerContentComponent
  ],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {

  @Output() tabSelected = new EventEmitter<string>();

  constructor(private router: Router) {


  }

  selectTab(tab: string) {
    this.tabSelected.emit(tab);
  }





}
