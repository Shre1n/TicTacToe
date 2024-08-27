import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ConnectService} from "../../services/connect.service";
import {ReadUserService} from "../../services/user/readUser/read-user.service";
import {ReadUserProfilePictureService} from "../../services/user/readUserProfilePicture/read-user-profile-picture.service";
import {LogoutService} from "../../Auth/logout/services/logout.service";
import {TictactoeService} from "../../tic-tac-toe/services/tictactoe.service";

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
    private logOut: LogoutService,
    private connectService: ConnectService,
    public readUser: ReadUserService,
    public readProfile: ReadUserProfilePictureService,
    private tictactoeService: TictactoeService
    ) {

  }

  ngOnInit(){
    this.readUser.readUser();
  }



  logout(){
    this.logOut.logout();
  }

  navProfile(){
    this.router.navigate(['/player-profile'])
  }


  navMatchMaking(){
    this.connectService.enterQueue();
    this.router.navigate(['/matchMaking'])
  }

}
