import { Component } from '@angular/core';
import { UserService } from '../../User/user.service';
import { PlayNowComponent } from '../play-now/play-now.component';
import { LoginComponent } from '../../Auth/login/login.component';

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [PlayNowComponent, LoginComponent],
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.css'
})
export class HomeViewComponent {
  constructor(public userService: UserService) {}
}
