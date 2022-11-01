import { Component, EventEmitter } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs';
import { ISave } from '../models';
import { AuthService } from './service/auth.service';
import { DatabaseService } from './service/database.service';
import { DigimonBackendService } from './service/digimon-backend.service';
import {
  loadSave,
  setBlogs,
  setCommunityDecks,
  setSave,
} from './store/digimon.actions';
import { emptySave } from './store/reducers/save.reducer';

@Component({
  selector: 'digimon-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  localStorageSave: ISave;
  spinner = true;
  hide = true;

  noSaveDialog = false;
  retryDialog = false;
  showChangelog = false;

  loadChangelog = new EventEmitter<boolean>();

  constructor(
    private store: Store,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private messageService: MessageService,
    private meta: Meta,
    private title: Title,
    private digimonBackendService: DigimonBackendService
  ) {
    this.makeGoogleFriendly();

    this.getDecks();
    this.getBlogs();

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
    this.title.setTitle('Digimon Card Game');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Digimon Card Game (TCG) Deckbuilder for keeping track of your collection of cards and building casual decks and tournament decks.' +
          'You can very easily create decks with various filters for the cards, you can even check which cards are missing in your collection' +
          'Share your decks and your profil with the community or just your friends, to share insights and make trading a whole lot easier.',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content:
          'Digimon, digimon, Card, card, Game, game, Cardgame, Collecting, Deck, Deckbuilder, Casual, TCG, English, Japanese, Tracking, builder, tournament, reports',
      },
    ]);
  }

  /**
   * Load the User-Save
   * a) If the User is logged in, load the data from the database
   * b) If the User is not logged in, load the data from the local storage
   */
  private loadSave(): void {
    this.checkForSave();

    if (!this.authService.isLoggedIn) {
      this.startLoginOfflineDialog();
      return;
    }

    this.digimonBackendService
      .getSave(this.authService.userData!.uid)
      .pipe(first())
      .subscribe((saveOrNull: ISave | null) => {
        if (!saveOrNull) {
          this.retry();
          return;
        }
        this.spinner = false;
        this.hide = false;
        let save = saveOrNull as ISave;

        if (save.version !== emptySave.version) {
          this.showChangelogModal();
        }

        this.store.dispatch(
          setSave({ save: { ...save, version: emptySave.version } })
        );
      });
  }

  private startRetryDialog() {
    this.spinner = false;
    this.retryDialog = true;
  }

  retry() {
    this.spinner = true;
    this.retryDialog = false;
    this.loadSave();
  }

  loadBackup(input: any) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        let save: any = JSON.parse(fileReader.result as string);
        save = this.digimonBackendService.checkSaveValidity(save, null);
        this.store.dispatch(loadSave({ save }));
        this.messageService.add({
          severity: 'success',
          summary: 'Save loaded!',
          detail: 'The save was loaded successfully!',
        });
        this.retryDialog = false;
        this.spinner = false;
        this.hide = false;
      } catch (e) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Save Error!',
          detail: 'The save was not loaded!',
        });
      }
    };
    fileReader.readAsText(input.files[0]);
  }

  private checkForSave() {
    this.authService.checkLocalStorage();

    const found = localStorage.getItem('Digimon-Card-Collector');
    this.localStorageSave = found ? JSON.parse(found) : null;
  }

  private startLoginOfflineDialog() {
    if (this.localStorageSave) {
      this.localStorageSave = this.digimonBackendService.checkSaveValidity(
        this.localStorageSave,
        this.authService.userData
      );
      this.store.dispatch(loadSave({ save: this.localStorageSave }));
      this.spinner = false;
      this.hide = false;
      return;
    }

    this.spinner = false;
    this.createANewSave();
  }

  loginWithGoogle() {
    this.authService.GoogleAuth().then(() => {
      this.hide = false;
      this.noSaveDialog = false;
      this.retryDialog = false;
    });
  }

  createANewSave() {
    this.hide = false;
    this.noSaveDialog = false;
    this.retryDialog = false;
    this.store.dispatch(setSave({ save: emptySave }));
  }

  showChangelogModal() {
    this.showChangelog = true;
    this.loadChangelog.emit(true);
  }

  getDecks() {
    const sub = this.digimonBackendService
      .getDecks()
      .subscribe((communityDecks) => {
        this.store.dispatch(setCommunityDecks({ communityDecks }));
        sub.unsubscribe();
      });
  }

  getBlogs() {
    const sub = this.digimonBackendService
      .getBlockEntries()
      .subscribe((blogs) => {
        this.store.dispatch(setBlogs({ blogs }));
        sub.unsubscribe();
      });
  }
}
