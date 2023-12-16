import { NgIf } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { first } from 'rxjs';
import { ISave } from '../models';
import { ChangelogDialogComponent } from './features/shared/dialogs/changelog-dialog.component';
import { NavbarComponent } from './features/shared/navbar.component';
import { AuthService } from './service/auth.service';
import { DigimonBackendService } from './service/digimon-backend.service';
import { SaveActions } from './store/digimon.actions';
import { emptySave } from './store/reducers/save.reducer';

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
      <digimon-changelog-dialog
        [loadChangelog]="loadChangelog"></digimon-changelog-dialog>
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
    private digimonBackendService: DigimonBackendService,
    private toastrService: ToastrService
  ) {
    //this.loadSave();

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
    if (
      !this.authService.userInLocalStorage() &&
      !this.authService.isLoggedIn
    ) {
      this.loadLocalStorageSave();
      return;
    }

    this.digimonBackendService
      .getSave(this.authService.userData!.uid)
      .pipe(first())
      .subscribe((save: ISave | null) => {
        if (!save) {
          this.retry();
          this.retryCounter += 1;
          return;
        }

        if (save.version !== emptySave.version) {
          this.showChangelogModal();
        }

        this.store.dispatch(
          SaveActions.setsave({ save: { ...save, version: emptySave.version } })
        );
        this.toastrService.info(
          'Your save was loaded successfully!',
          'Welcome back!'
        );

        this.spinner = false;
        this.hide = false;
      });
  }

  private retry() {
    this.spinner = true;
    this.loadSave();
  }

  // Check local storage for a backup save, if there is none create a new save
  private loadLocalStorageSave() {
    const localStorageSave = localStorage.getItem('Digimon-Card-Collector');
    this.localStorageSave = localStorageSave
      ? JSON.parse(localStorageSave)
      : null;

    if (this.localStorageSave) {
      this.localStorageSave = this.digimonBackendService.checkSaveValidity(
        this.localStorageSave,
        this.authService.userData
      );
      this.store.dispatch(
        SaveActions.setsave({
          save: { ...this.localStorageSave, version: emptySave.version },
        })
      );
      this.spinner = false;
      this.hide = false;
      this.toastrService.info(
        'Save from browser loaded successfully!',
        'Welcome back!'
      );
      return;
    }

    this.hide = false;
    this.spinner = false;
    this.store.dispatch(SaveActions.setsave({ save: emptySave }));
    this.toastrService.info(
      'Welcome to digimoncard.app a new save was created for you!',
      'Welcome new User'
    );
  }

  private showChangelogModal() {
    this.showChangelog = true;
    this.loadChangelog.emit(true);
  }
}
