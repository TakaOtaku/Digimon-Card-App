import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { map } from 'rxjs';
import { ISave } from '../models';
import { ChangelogDialogComponent } from './features/shared/dialogs/changelog-dialog.component';
import { NavbarComponent } from './features/shared/navbar.component';
import { SaveActions } from './store/digimon.actions';
import { selectSave } from './store/digimon.selectors';

@Component({
  selector: 'digimon-root',
  template: `
    <div class="max-w-full flex flex-row min-w-full">
      <digimon-navbar></digimon-navbar>

      <router-outlet #router *ngIf="(noSaveLoaded$ | async) === false"></router-outlet>

      <ng-container *ngIf="noSaveLoaded$ | async as noSaveLoaded">
        <div *ngIf="noSaveLoaded" class="h-[calc(100vh-58px)] w-screen"></div>
        <p-blockUI [blocked]="noSaveLoaded"></p-blockUI>
        <p-progressSpinner
          *ngIf="noSaveLoaded"
          class="absolute left-1/2 top-1/2 z-[5000] -translate-x-1/2 -translate-y-1/2 transform"></p-progressSpinner>
      </ng-container>

      <p-toast></p-toast>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    FormsModule,
    AsyncPipe
  ]
})
export class AppComponent {
  noSaveLoaded$ = this.store.select(selectSave).pipe(
    map((save: ISave) => save.uid === '')
  );

  constructor(private store: Store) {
    this.store.dispatch(SaveActions.loadSave());

    document.addEventListener(
      'contextmenu',
      function (e) {
        e.preventDefault();
      },
      false
    );
  }
}
