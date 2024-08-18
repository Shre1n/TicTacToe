import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./Auth/login/login.component";
import {RegisterComponent} from "./Auth/register/register.component";
import {NgModule} from "@angular/core";
import {PlayNowComponent} from "./Site-View/play-now/play-now.component";
import {MatchMakingComponent} from "./Site-View/match-making/match-making.component";
import {PlayerProfileComponent} from "./User/player-profile/player-profile.component";
import {AdminDashboardComponent} from "./Admin/admin-dashboard/admin-dashboard.component";
import {Forbidden403Component} from "./Error-Components/forbidden-403/forbidden-403.component";
import {AdminGuard} from "./Admin/admin-dashboard/guard/adminGuard";
import {NotFound404Component} from "./Error-Components/not-found404/not-found404.component";
import {AuthGuard} from "./Auth/guard/AuthGuard";
import {Unauthorized401Component} from "./Error-Components/unauthorized-401/unauthorized-401.component";

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard]},
  {path: 'play-now', title:'Play-Now', component: PlayNowComponent, canActivate: [AuthGuard]},
  {path: 'matchMaking', title:'Matchmaking', component: MatchMakingComponent, canActivate: [AuthGuard]},
  {path: 'player-profile', title:'Profile', component: PlayerProfileComponent, canActivate: [AuthGuard]},
  {path: 'forbidden', title:'403 - Forbidden', component: Forbidden403Component},
  {path: 'unauthorized', title:'401 - Unauthorized', component: Unauthorized401Component},
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

