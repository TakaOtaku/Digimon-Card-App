import { Component, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs';
import { ISave } from '../models';
import { AuthService } from './service/auth.service';
import { CardMarketService } from './service/card-market.service';
import { DigimonBackendService } from './service/digimon-backend.service';
import { loadSave, setBlogs, setCommunityDecks, setPriceGuideCM, setSave } from './store/digimon.actions';
import { emptySave } from './store/reducers/save.reducer';
import { ChangelogDialogComponent } from './features/shared/dialogs/changelog-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { NavbarComponent } from './features/shared/navbar.component';

@Component({
  selector: 'digimon-root',
  template: `
    <div class="relative">
      <digimon-navbar></digimon-navbar>

      <router-outlet #router *ngIf="!hide"></router-outlet>

      <div *ngIf="hide" class="h-[calc(100vh-58px)] w-screen"></div>
      <p-blockUI [blocked]="spinner"></p-blockUI>
      <p-progressSpinner
        *ngIf="spinner"
        class="absolute left-1/2 top-1/2 z-[5000] -translate-x-1/2 -translate-y-1/2 transform"></p-progressSpinner>

      <p-toast></p-toast>

      <p-confirmDialog
        header="Delete Confirmation"
        icon="pi pi-exclamation-triangle"
        key="Delete"
        rejectButtonStyleClass="p-button-outlined"></p-confirmDialog>

      <p-confirmDialog
        header="New Deck Confirmation"
        icon="pi pi-file"
        key="NewDeck"
        rejectButtonStyleClass="p-button-outlined"></p-confirmDialog>
    </div>

    <p-dialog
      [(visible)]="showChangelog"
      [closeOnEscape]="true"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      header="Changelog">
      <digimon-changelog-dialog [loadChangelog]="loadChangelog"></digimon-changelog-dialog>
    </p-dialog>
  `,
  standalone: true,
  imports: [
    NavbarComponent,
    NgIf,
    RouterOutlet,
    BlockUIModule,
    ProgressSpinnerModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    ChangelogDialogComponent,
  ],
  providers: [MessageService],
})
export class AppComponent {
  localStorageSave: ISave;
  spinner = true;
  hide = true;
  retryCounter = 0;

  showChangelog = false;

  loadChangelog = new EventEmitter<boolean>();

  constructor(
    private store: Store,
    private authService: AuthService,
    private messageService: MessageService,
    private digimonBackendService: DigimonBackendService,
    private cardMarketService: CardMarketService
  ) {
    this.getDecks();
    this.getBlogs();

    this.loadSave();

    this.loadPriceGuide();

    document.addEventListener(
      'contextmenu',
      function (e) {
        e.preventDefault();
      },
      false
    );
  }

  /**
   * Load the User-Save
   * a) If the User is logged in, load the data from the database
   * b) If the User is not logged in, load the data from the local storage
   */
  private loadSave(): void {
    this.checkForSave();

    if (!this.authService.isLoggedIn) {
      this.loadBackupSave();
      return;
    }

    this.digimonBackendService
      .getSave(this.authService.userData!.uid)
      .pipe(first())
      .subscribe((saveOrNull: ISave | null) => {
        /*if (this.retryCounter < 3) {
          this.messageService.add({
            severity: 'error',
            summary: 'Could not load your Save!',
            detail:
              'There was an error with loading your save. A new local save will be created.',
          });
          this.hide = false;
          this.spinner = false;
          this.store.dispatch(setSave({ save: emptySave }));
          return;
        }*/
        if (!saveOrNull) {
          this.retry();
          this.retryCounter += 1;
          return;
        }

        let save = saveOrNull as ISave;
        if (save.version !== emptySave.version) {
          this.showChangelogModal();
        }
        this.spinner = false;
        this.hide = false;
        this.store.dispatch(setSave({ save: { ...save, version: emptySave.version } }));
      });
  }

  retry() {
    this.spinner = true;
    this.loadSave();
  }

  private checkForSave() {
    this.authService.checkLocalStorage();

    const found = localStorage.getItem('Digimon-Card-Collector');
    this.localStorageSave = found ? JSON.parse(found) : null;
  }

  // Check local storage for a backup save, if there is none create a new save
  private loadBackupSave() {
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

    this.hide = false;
    this.spinner = false;
    this.store.dispatch(setSave({ save: emptySave }));
  }

  showChangelogModal() {
    this.showChangelog = true;
    this.loadChangelog.emit(true);
  }

  getDecks() {
    this.digimonBackendService
      .getDecks()
      .pipe(first())
      .subscribe((communityDecks) => {
        this.store.dispatch(setCommunityDecks({ communityDecks }));
      });
  }

  getBlogs() {
    this.digimonBackendService
      .getBlogEntries()
      .pipe(first())
      .subscribe((blogs) => {
        this.store.dispatch(setBlogs({ blogs }));
      });
  }

  loadPriceGuide() {
    this.cardMarketService
      .getPrizeGuide()
      .pipe(first())
      .subscribe((products) => {
        this.store.dispatch(setPriceGuideCM({ products }));
      });
  }
}
