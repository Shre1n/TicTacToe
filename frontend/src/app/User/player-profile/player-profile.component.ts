import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {OptionsComponent} from "./options/options.component";
import {PlayerContentComponent} from "./player-content/player-content.component";
import {PlayerPasswordChangeComponent} from "./player-password-change/player-password-change.component";

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [
    OptionsComponent,
    PlayerContentComponent,
    PlayerPasswordChangeComponent
  ],
  templateUrl: './player-profile.component.html',
  styleUrl: './player-profile.component.css'
})
export class PlayerProfileComponent {


  activeTab: string = 'general';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }


  constructor(private router: Router) {
  }

}
