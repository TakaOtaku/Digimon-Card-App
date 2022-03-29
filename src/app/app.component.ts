import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {first} from "rxjs";
import {ISave} from "../models";
import {AuthService} from "./service/auth.service";
import {DatabaseService} from "./service/database.service";
import {loadSave} from './store/digimon.actions';

@Component({
  selector: 'digimon-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(
    private store: Store,
    private authService: AuthService,
    private databaseService: DatabaseService
  ) {
    this.loadSave();
  }

  /**
   * Load the User-Save
   * a) If the User is logged in, load the data from the database
   * b) If the User is not logged in, load the data from the local storage
   */
  private loadSave(): void {
    this.authService.checkLocalStorage();
    if (this.authService.isLoggedIn) {
      this.databaseService.loadSave(this.authService.userData!.uid).pipe(first())
        .subscribe((save: ISave) => {
          this.store.dispatch(loadSave({save}))
        });
    } else {
      const string = localStorage.getItem('Digimon-Card-Collector')
      let save: ISave = {collection: [], decks: [], settings: {cardSize: 50, collectionMode: true}};
      if (string) save = JSON.parse(string);


      this.store.dispatch(loadSave({save}));
    }

  }
}
