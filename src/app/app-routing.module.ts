import { NgModule } from '@angular/core';
import {HomeComponent} from "./home/home/home.component";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {PreferencesComponent} from "./preferences/preferences.component";
import {GameComponent} from "./game/game.component";
import {RecordsComponent} from "./records/records.component";
import {PagenotfoundComponent} from "./pagenotfound/pagenotfound.component";


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'preferences', component: PreferencesComponent},
  {path: 'game', component: GameComponent},
  {path: 'records', component: RecordsComponent},
  { path: '**', pathMatch: 'full',
    component: PagenotfoundComponent },



];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
