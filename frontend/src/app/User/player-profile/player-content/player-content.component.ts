import {Component, OnInit} from '@angular/core';
import {PlayerContentService} from "./service/player-content.service";
import { UserService } from '../../user.service';

@Component({
  selector: 'app-player-content',
  standalone: true,
  imports: [],
  templateUrl: './player-content.component.html',
  styleUrl: './player-content.component.css'
})
export class PlayerContentComponent implements OnInit{

  name = ""

  file: File | null = null;

  ngOnInit(){
   this.playerContent.getinfo();
  }

  constructor(public playerContent: PlayerContentService, public userService: UserService) {
  }


  selectedFile(event:any){
    this.file = event.target.files[0];
  }

  save(){
    this.playerContent.onUpload(this.file);
  }



}
