import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, first } from 'rxjs';
import * as uuid from 'uuid';
import { ISave } from '../models';
import { SITES } from './pages/main-page/main-page.component';
import { AuthService } from './service/auth.service';
import { DatabaseService } from './service/database.service';
import { loadSave, setDeck, setSite } from './store/digimon.actions';
import { emptySave } from './store/reducers/save.reducer';

@Component({
  selector: 'digimon-root',
  template: '<router-outlet></router-outlet>',
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
    this.makeGoogleFriendly();

    this.loadSave();

    this.checkForDeckLink();

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
    } else {
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

  /**
   * Check if it is a deck-link, then search for the deck in the database and set the site view to deckbuilder
   */
  private checkForDeckLink() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url.includes('?deck=')) {
          this.databaseService
            .loadDeck(event.url.substring(7))
            .pipe(filter((value) => value.cards.length > 0))
            .subscribe((deck) => {
              this.store.dispatch(
                setDeck({
                  deck: { ...deck, id: uuid.v4(), rating: 0, ratingCount: 0 },
                })
              );
              this.store.dispatch(setSite({ site: SITES.DeckBuilder }));
            });
        }
      });
  }
}
