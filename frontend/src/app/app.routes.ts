import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {NgModule} from "@angular/core";
import {PlayNowComponent} from "./play-now/play-now.component";
import {MatchMakingComponent} from "./match-making/match-making.component";
import {PlayerProfileComponent} from "./player-profile/player-profile.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {Forbidden403Component} from "./forbidden-403/forbidden-403.component";
import {AdminGuard} from "./admin-dashboard/guard/adminGuard";
import {NotFound404Component} from "./not-found404/not-found404.component";

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard]},
  {path: 'play-now', title:'Play-Now', component: PlayNowComponent},
  {path: 'matchMaking', title:'Matchmaking', component: MatchMakingComponent},
  {path: 'player-profile', title:'Profile', component: PlayerProfileComponent},
  {path: 'forbidden', title:'forbidden - Forbidden', component: Forbidden403Component},
  {path: 'NotFound', title: 'Not Found', component: NotFound404Component},
  { path: '**', redirectTo: '/NotFound'}
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes,{useHash: false})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

