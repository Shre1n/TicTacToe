import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ConnectService} from "../../services/connect.service";
import {ReadUserService} from "../../services/user/readUser/read-user.service";
import {ReadUserProfilePictureService} from "../../services/user/readUserProfilePicture/read-user-profile-picture.service";
import {AuthService} from "../../services/user/auth/auth.service";

@Component({
  selector: 'app-play-now',
  standalone: true,
  imports: [],
  templateUrl: './play-now.component.html',
  styleUrl: './play-now.component.css'
})
export class PlayNowComponent implements OnInit{


  constructor(
    private router: Router,
    private authService: AuthService,
    private connectService: ConnectService,
    public readUser: ReadUserService,
    public readProfile: ReadUserProfilePictureService) {

  }

  ngOnInit(){
    this.readUser.readUser();
  }

  logout(){
    this.authService.logout();
  }

  navProfile(){
    //todo navigate to profile
    this.router.navigate(['/player-profile'])
  }


  navMatchMaking(){
    this.connectService.enterQueue();
    this.router.navigate(['/matchMaking'])
  }

}
