import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {PassingArgumentsService} from "../services/passing-arguments.service";

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

  constructor(private router: Router, private passingArgumentsService: PassingArgumentsService) {

  }

  ngOnInit(): void {
    this.passingArgumentsService.getCurrentUsername().subscribe({
      next: (data) => {
        this.username = data.username
        console.log(data.username)
      },
      error: (err) => console.error('Fehler beim Abrufen des Benutzernamens', err)
    });
    console.log(this.username)
  }

  navProfile(){
    //todo navigate to profile
    this.router.navigate(['/profile'])
  }




  navMatchMaking(){
    //todo pass user information directly with queryParams
    this.router.navigate(['/matchMaking'], {queryParams: {username: this.username}})
  }

}
