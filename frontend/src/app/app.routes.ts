import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {NgModule} from "@angular/core";
import {PlayNowComponent} from "./play-now/play-now.component";
import {MatchMakingComponent} from "./match-making/match-making.component";

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', title:'Login', component: LoginComponent},
  {path: 'register', title:'Register', component: RegisterComponent},
  {path: 'play-now', title:'Play-Now', component: PlayNowComponent},
  {path: 'matchMaking', title:'Matchmaking', component: MatchMakingComponent},

  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes,{useHash: false})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

