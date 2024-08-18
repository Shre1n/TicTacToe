import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PlayerContentService} from "./service/player-content.service";
import {ImageLoaderConfig} from "@angular/common";
import {ReadUserService} from "../../../services/user/readUser/read-user.service";
import {
  ReadUserProfilePictureService
} from "../../../services/user/readUserProfilePicture/read-user-profile-picture.service";

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
    this.playerContent.readUser();
  }

  constructor(private http: HttpClient, public playerContent: PlayerContentService, public readUser: ReadUserService, public readProfile: ReadUserProfilePictureService) {
  }


  selectedFile(event:any){
    this.file = event.target.files[0];
  }

  save(){
    this.playerContent.onUpload(this.file);
  }



}
