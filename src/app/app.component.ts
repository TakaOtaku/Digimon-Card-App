import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { first } from 'rxjs';
import { CARDSET, emptyFilter, IFilter } from '../models';
import { ChangelogDialogComponent } from './features/shared/dialogs/changelog-dialog.component';
import { SettingsDialogComponent } from './features/shared/dialogs/settings-dialog.component';
import { FilterSideBoxComponent } from './features/shared/filter/filter-side-box.component';
import { NavLinksComponent } from './features/shared/navbar/nav-links.component';
import { NavbarComponent } from './features/shared/navbar/navbar.component';
import { filterCards } from './functions';
import { AuthService } from './services/auth.service';
import { DigimonBackendService } from './services/digimon-backend.service';
import { DialogStore } from './store/dialog.store';
import { DigimonCardStore } from './store/digimon-card.store';
import { FilterStore } from './store/filter.store';
import { SaveStore } from './store/save.store';
import { WebsiteStore } from './store/website.store';

@Component({
  selector: 'digimon-root',
  template: `
    <div
      class="flex flex-col lg:flex-row bg-gradient-to-b from-[#17212f] to-[#08528d]">
      <digimon-navbar (openSideNav)="sideNav = true"></digimon-navbar>

      <div
        class="min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-5rem)] lg:min-h-[100vh]
        w-[100vw] lg:max-w-[calc(100vw-6.5rem)] lg:w-[calc(100vw-6.5rem)]
        flex justify-center items-center">
        <router-outlet *ngIf="saveLoaded"></router-outlet>
      </div>

      <ng-container *ngIf="!saveLoaded">
        <div class="h-[calc(100vh-58px)] w-screen"></div>
        <p-blockUI [blocked]="true"></p-blockUI>
        <p-progressSpinner
          class="absolute left-1/2 top-1/2 z-[5000] -translate-x-1/2 -translate-y-1/2 transform"></p-progressSpinner>
      </ng-container>

      <p-sidebar
        [(visible)]="sideNav"
        styleClass="w-[6.5rem] overflow-hidden p-0">
        <ng-template pTemplate="content" class="p-0">
          <digimon-nav-links
            class="flex flex-col w-full justify-center"
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
        styleClass="background-darker surface-ground w-full h-full max-w-6xl min-h-[500px]">
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
    FilterSideBoxComponent,
  ],
})
export class AppComponent {
  digimonCardStore = inject(DigimonCardStore);
  saveStore = inject(SaveStore);
  filterStore = inject(FilterStore);
  dialogStore = inject(DialogStore);
  websiteStore = inject(WebsiteStore);

  authService = inject(AuthService);
  backendService = inject(DigimonBackendService);

  saveLoaded = true;

  sideNav = false;
  settingsDialog = this.dialogStore.settings();

  constructor() {
    this.saveStore.loadSave();

    effect(() => {
      console.log('Cards changed: ', this.digimonCardStore.cards());
    });

    effect(() => {
      console.log('Save changed: ', this.saveStore.save());
      this.saveLoaded = this.saveStore.save().uid === '';

      if (!this.saveStore.loadedSave()) return;

      console.log('Update Save in the Database');
      this.updateDatabase();

      console.log('Change Advanced Settings');
      this.setAdvancedSettings();

      console.log('Set DigimonCard Set');
      this.setDigimonCardSet();
    }, { allowSignalWrites: true });

    effect(() => {
      console.log('Filter changed: ', this.filterStore.filter());
      const cards = this.digimonCardStore.cards();

      if (cards.length === 0) return;

      const filteredCards = filterCards(
        this.digimonCardStore.cards(),
        this.saveStore.collection(),
        this.filterStore.filter(),
        this.websiteStore.sort(),
        this.digimonCardStore.cardsMap(),
      );

      this.digimonCardStore.updateFilteredCards(filteredCards);
    }, { allowSignalWrites: true });

    // Prevent Right Click, that is used for other actions
    document.addEventListener(
      'contextmenu',
      function (e) {
        e.preventDefault();
      },
      false,
    );
  }

  private updateDatabase(): void {
    const save = this.saveStore.save();
    if (this.authService.isLoggedIn) {
      this.backendService
        .updateSave(save)
        .pipe(first())
        .subscribe(() => {});
    } else {
      localStorage.setItem('Digimon-Card-Collector', JSON.stringify(save));
    }
  }

  private setAdvancedSettings(): void {
    const settings = this.saveStore.settings();

    if (
      settings.showPreRelease === undefined ||
      settings.showAACards === undefined ||
      settings.showStampedCards === undefined ||
      settings.showReprintCards === undefined
    ) {
      return;
    }

    let filter: IFilter = emptyFilter;
    filter = { ...filter, versionFilter: [] };
    if (!settings.showPreRelease) {
      let versionFilter = filter.versionFilter.filter(
        (filter) => filter !== 'Pre-Release',
      );
      if (versionFilter.length === 0) {
        versionFilter = ['Normal', 'AA', 'Stamp', 'Reprint'];
      }
      filter = { ...filter, versionFilter };
    }
    if (!settings.showAACards) {
      let versionFilter = filter.versionFilter.filter(
        (filter) => filter !== 'AA',
      );
      if (versionFilter.length === 0) {
        versionFilter = ['Normal', 'Stamp', 'Pre-Release', 'Reprint'];
      }
      filter = { ...filter, versionFilter };
    }
    if (!settings.showStampedCards) {
      let versionFilter = filter.versionFilter.filter(
        (filter) => filter !== 'Stamp',
      );
      if (versionFilter.length === 0) {
        versionFilter = ['Normal', 'AA', 'Pre-Release', 'Reprint'];
      }
      filter = { ...filter, versionFilter };
    }
    if (!settings.showReprintCards) {
      let versionFilter = filter.versionFilter.filter(
        (filter) => filter !== 'Reprint',
      );
      if (versionFilter.length === 0) {
        versionFilter = ['Normal', 'AA', 'Pre-Release', 'Stamp'];
      }
      filter = { ...filter, versionFilter };
    }

    this.filterStore.updateFilter(filter);
  }

  private setDigimonCardSet(): void {
    const cardSet = this.saveStore.settings().cardSet;
    if (cardSet === undefined) {
      return;
    }

    this.digimonCardStore.updateCards(cardSet as CARDSET);
  }
}
