import { Component } from '@angular/core';
import {PersistenceService} from "../../shared/services/persistence.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  isLogged: boolean = false;

  constructor(private persistence: PersistenceService) {
    this.isLogged = this.persistence.isLogged;
    this.persistence.loggedChange.subscribe((value) => {
      this.isLogged = value;
    })
  }

  logout(): void {
    this.persistence.setToken(null);
  }

}
