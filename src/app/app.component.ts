import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { ISave } from '../models';
import { AuthService } from './service/auth.service';
import { DatabaseService } from './service/database.service';
import { loadSave } from './store/digimon.actions';
import { emptySave } from './store/reducers/save.reducer';

@Component({
  selector: 'digimon-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private store: Store,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private meta: Meta,
    private title: Title
  ) {
    this.makeGoogleFriendly();

    this.loadSave();

    document.addEventListener(
      'contextmenu',
      function (e) {
        e.preventDefault();
      },
      false
    );
  }

  /**
   * Optimize Website search engines
   */
  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card APP');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Digimon Card Game Site for collecting cards and building decks',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content:
          'Digimon, Card, Game, Collecting, Deck, Deckbuilder, Casual, TCG, English, Japanese, Tracking',
      },
    ]);
  }

  /**
   * Load the User-Save
   * a) If the User is logged in, load the data from the database
   * b) If the User is not logged in, load the data from the local storage
   */
  private loadSave(): void {
    this.authService.checkLocalStorage();

    if (this.authService.isLoggedIn) {
      this.databaseService
        .loadSave(this.authService.userData!.uid, this.authService.userData)
        .pipe(first())
        .subscribe((save: ISave) => this.store.dispatch(loadSave({ save })));
      return;
    }

    const string = localStorage.getItem('Digimon-Card-Collector');
    let save: ISave = emptySave;
    if (string) save = JSON.parse(string);

    save = this.databaseService.checkSaveValidity(
      save,
      this.authService.userData
    );

    this.store.dispatch(loadSave({ save }));
  }
}
