import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {NgModule} from "@angular/core";
import {PlayerProfileComponent} from "./player-profile/player-profile.component";
import {OptionsComponent} from "./player-profile/options/options.component";

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'player-profile', component: PlayerProfileComponent},
  {path: 'r', component: OptionsComponent},
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes,{useHash: false})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

