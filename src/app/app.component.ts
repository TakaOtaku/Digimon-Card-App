import {Component} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {Store} from '@ngrx/store';
import {MessageService} from 'primeng/api';
import {first} from 'rxjs';
import {ISave} from '../models';
import {AuthService} from './service/auth.service';
import {DatabaseService} from './service/database.service';
import {loadSave, setSave} from './store/digimon.actions';
import {emptySave} from './store/reducers/save.reducer';

/**
 * Make the Website SEO-Friendly
 * Block right-clicking
 * Check for a Save in the local Storage
 *  found: Load the current save from the database
 *  not found: Ask the user to login or create a new save
 *    new save: Create a New Save
 *    login: Try to login with google
 *      success: Log-in with Google
 *      error: try again or contact me
 */
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
  hideChangelog = true;

  constructor(
    private store: Store,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private messageService: MessageService,
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
    this.checkForSave();

    if (!this.authService.isLoggedIn) {
      this.startLoginOfflineDialog();
      return;
    }

    this.databaseService
      .loadSave(this.authService.userData!.uid, this.authService.userData)
      .pipe(first())
      .subscribe((saveOrNull: ISave | null) => {
        if (!saveOrNull) {
          this.startRetryDialog();
          return;
        }
        this.spinner = false;
        this.hide = false;
        let save = saveOrNull as ISave;
        this.store.dispatch(loadSave({save}));
        this.hideChangelog = save.version === emptySave.version;
        //this.store.dispatch(setSave({save: {...save, version: emptySave.version}}))
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
        save = this.databaseService.checkSaveValidity(save, null);
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
      this.localStorageSave = this.databaseService.checkSaveValidity(
        this.localStorageSave,
        this.authService.userData
      );
      this.store.dispatch(loadSave({ save: this.localStorageSave }));
      this.spinner = false;
      this.hide = false;
      return;
    }

    this.spinner = false;
    this.noSaveDialog = true;
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
}
