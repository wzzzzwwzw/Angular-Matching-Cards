import { NgModule } from '@angular/core';
import {HomeComponent} from "./home/home/home.component";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {PreferencesComponent} from "./preferences/preferences.component";
import {GameComponent} from "./game/game.component";


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'preferences', component: PreferencesComponent},
  {path: 'game', component: GameComponent},


  {path: '', redirectTo: '/home', pathMatch: 'full'},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
