import {Component} from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {first} from "rxjs";
import {ISave} from "../models";
import {AuthService} from "./service/auth.service";
import {DatabaseService} from "./service/database.service";
import {loadSave} from './store/digimon.actions';
import {emptySettings} from "./store/reducers/save.reducer";

@Component({
  selector: 'digimon-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(
    private store: Store,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private meta: Meta,
    private title: Title,
    private router: Router
  ) {
    this.loadSave();
    this.makeGoogleFriendly();

    this.checkForDeckLink();

    document.addEventListener("contextmenu", function (e){
      e.preventDefault();
    }, false);
  }

  /**
   * Load the User-Save
   * a) If the User is logged in, load the data from the database
   * b) If the User is not logged in, load the data from the local storage
   */
  private loadSave(): void {
    this.authService.checkLocalStorage();
    if (this.authService.isLoggedIn) {
      this.databaseService.loadSave(this.authService.userData!.uid, this.authService.userData).pipe(first())
        .subscribe((save: ISave) => this.store.dispatch(loadSave({save})));
    } else {
      const string = localStorage.getItem('Digimon-Card-Collector')
      let save: ISave = {collection: [], decks: [], settings: emptySettings};
      if (string) save = JSON.parse(string);

      save = this.databaseService.checkSaveValidity(save, this.authService.userData);

      this.store.dispatch(loadSave({save}));
    }
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card APP');

    this.meta.addTags([
      {name: 'description', content: 'Digimon Card Game Site for collecting cards and building decks'},
      {name: 'author', content: 'TakaOtaku'},
      {name: 'keywords', content: 'Digimon, Card, Game, Collecting, Deck, Deckbuilder, Tournament, Casual, TCG'}
    ]);
  }

  private checkForDeckLink() {
  }
}
