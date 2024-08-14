import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {PassingArgumentsService} from "../services/passing-arguments.service";
import {ConnectService} from "../services/connect.service";

@Component({
  selector: 'app-play-now',
  standalone: true,
  imports: [],
  templateUrl: './play-now.component.html',
  styleUrl: './play-now.component.css'
})
export class PlayNowComponent implements OnInit{

  //get Username from Backend API
  username: string = '';

  constructor(private router: Router, private connectService: ConnectService) {

  }

  ngOnInit(): void {}

  navProfile(){
    //todo navigate to profile
    this.router.navigate(['/profile'])
  }




  navMatchMaking(){
    this.connectService.enterQueue();
    //todo pass user information directly with queryParams
    this.router.navigate(['/matchMaking'])
  }

}
