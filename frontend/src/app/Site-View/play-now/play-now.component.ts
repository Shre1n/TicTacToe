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
    this.readUser.readUser().subscribe({
      next: (user) => {
        console.log('User loaded:', user);
        this.checkForActiveGame();
      },
      error: (err) => {
        console.error('Failed to read user:', err);
      }
    });
  }


  checkForActiveGame() {
    this.tictactoeService.loadFromApi().subscribe({
      next: () => {
        if (this.tictactoeService.gameId !== 0) {
          this.router.navigate(['/tictactoe']);
        }
      },
      error: (err) => {
        console.error('Failed to load game:', err);
      }
    });
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
