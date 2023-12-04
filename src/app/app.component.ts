import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { map } from 'rxjs';
import { ISave } from '../models';
import { ChangelogDialogComponent } from './features/shared/dialogs/changelog-dialog.component';
import { SettingsDialogComponent } from './features/shared/dialogs/settings-dialog.component';
import { NavLinksComponent } from './features/shared/navbar/nav-links.component';
import { NavbarComponent } from './features/shared/navbar/navbar.component';
import { SaveActions } from './store/digimon.actions';
import { selectSave } from './store/digimon.selectors';

@Component({
  selector: 'digimon-root',
  template: `
    <div class="max-w-full flex flex-col lg:flex-row min-w-full">
      <digimon-navbar
        (openSideNav)="sideNav = true"
        (settingsShow)="this.settingsDialog = true"></digimon-navbar>

      <router-outlet
        #router
        *ngIf="(noSaveLoaded$ | async) === false"></router-outlet>

      <ng-container *ngIf="noSaveLoaded$ | async as noSaveLoaded">
        <div *ngIf="noSaveLoaded" class="h-[calc(100vh-58px)] w-screen"></div>
        <p-blockUI [blocked]="noSaveLoaded"></p-blockUI>
        <p-progressSpinner
          *ngIf="noSaveLoaded"
          class="absolute left-1/2 top-1/2 z-[5000] -translate-x-1/2 -translate-y-1/2 transform"></p-progressSpinner>
      </ng-container>

      <p-sidebar
        [(visible)]="sideNav"
        styleClass="w-[6.5rem] overflow-hidden p-0">
        <ng-template pTemplate="content" class="p-0">
          <digimon-nav-links
            class="flex flex-col w-full justify-center"
            (settingsShow)="this.settingsDialog = true"
            [sidebar]="true"></digimon-nav-links>
        </ng-template>
      </p-sidebar>

      <p-dialog
        [(visible)]="settingsDialog"
        [baseZIndex]="10000"
        [modal]="true"
        [dismissableMask]="true"
        [resizable]="false"
        header="Settings"
        styleClass="w-full h-full max-w-6xl min-h-[500px]">
        <digimon-settings-dialog></digimon-settings-dialog>
      </p-dialog>

      <p-toast></p-toast>
    </div>
  `,
  standalone: true,
  styleUrls: ['./app.component.scss'],
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
    AsyncPipe,
    NavLinksComponent,
    SidebarModule,
    SettingsDialogComponent,
  ],
})
export class AppComponent {
  noSaveLoaded$ = this.store
    .select(selectSave)
    .pipe(map((save: ISave) => save.uid === ''));

  sideNav = false;
  settingsDialog = false;

  constructor(private store: Store) {
    this.store.dispatch(SaveActions.loadSave());

    document.addEventListener(
      'contextmenu',
      function (e) {
        e.preventDefault();
      },
      false,
    );
  }
}
