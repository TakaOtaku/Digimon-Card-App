import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { filterCards } from '@functions';
import { CARDSET, emptyFilter, emptySave, IFilter, ISettings } from '@models';
import { AuthService, DigimonBackendService } from '@services';
import { DigimonCardStore, FilterStore, SaveStore, WebsiteStore } from '@store';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { first } from 'rxjs';
import { DialogComponent } from './features/shared/dialog.component';
import { NavLinksComponent } from './features/shared/navbar/nav-links.component';
import { NavbarComponent } from './features/shared/navbar/navbar.component';

@Component({
  selector: 'digimon-root',
  template: `
    <div class="flex flex-col lg:flex-row bg-gradient-to-b from-[#17212f] to-[#08528d]">
      <digimon-navbar (openSideNav)="sideNav = true"></digimon-navbar>

      @if (saveLoaded()) {
        <div
          class="min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-5rem)] lg:min-h-[100vh]
        w-[100vw] lg:max-w-[calc(100vw-6.5rem)] lg:w-[calc(100vw-6.5rem)]
        flex justify-center items-center">
          <router-outlet></router-outlet>
        </div>
      } @else {
        <div class="h-[calc(100vh-58px)] w-screen"></div>
        <p-blockUI [blocked]="!saveLoaded()"></p-blockUI>
        <p-progressSpinner class="absolute left-1/2 top-1/2 z-[5000] -translate-x-1/2 -translate-y-1/2 transform"></p-progressSpinner>
      }

      <digimon-dialog></digimon-dialog>

      <p-sidebar [(visible)]="sideNav" styleClass="w-[6.5rem] overflow-hidden p-0">
        <ng-template pTemplate="content" class="p-0">
          <digimon-nav-links class="flex flex-col w-full justify-center" [sidebar]="true"></digimon-nav-links>
        </ng-template>
      </p-sidebar>

      <p-toast></p-toast>
    </div>
  `,
  standalone: true,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavbarComponent,
    RouterOutlet,
    BlockUIModule,
    ProgressSpinnerModule,
    SidebarModule,
    NavLinksComponent,
    ToastModule,
    DialogComponent,
  ],
})
export class AppComponent {
  digimonCardStore = inject(DigimonCardStore);
  saveStore = inject(SaveStore);
  filterStore = inject(FilterStore);
  websiteStore = inject(WebsiteStore);

  authService = inject(AuthService);
  backendService = inject(DigimonBackendService);

  saveLoaded = signal(false);

  sideNav = false;

  cardSet = '';
  settings: ISettings | null = null;

  onAuthChange = effect(() => {
    if (this.authService.isLoggedIn) {
      this.saveStore.updateSave(this.authService.currentUser().save);
    } else {
      this.saveStore.updateSave(this.authService.getLocalStorageSave() || emptySave);
    }
  });

  constructor() {
    // Check if a save is in local storage from a previous login
    // If this is the case, set the save
    this.saveStore.loadSave();

    effect(() => {
      console.log('Save changed', this.saveStore.save());
      this.saveLoaded.set(this.saveStore.save().uid !== '' || this.saveStore.loadedSave());

      if (!this.saveStore.loadedSave()) return;

      console.log('Update Save in the Database');
      this.updateDatabase();

      if (this.settings === null || this.settings !== this.saveStore.settings()) {
        console.log('Change Advanced Settings');
        this.setAdvancedSettings();
        this.settings = this.saveStore.settings();
      }

      if (this.cardSet !== this.saveStore.settings().cardSet) {
        console.log('Set DigimonCard Set');
        this.cardSet = this.saveStore.settings().cardSet;
        this.setDigimonCardSet();
      }
    });

    effect(() => {
      console.log('Filter changed');
      const cards = this.digimonCardStore.cards();

      if (cards.length === 0) return;

      const filteredCards = filterCards(
        this.digimonCardStore.cards(),
        this.saveStore.save(),
        this.filterStore.filter(),
        this.websiteStore.sort(),
        this.digimonCardStore.cardsMap(),
      );

      this.digimonCardStore.updateFilteredCards(filteredCards);
    });

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
      settings.showReprintCards === undefined ||
      settings.showSpecialRareCards === undefined ||
      settings.showRarePullCards === undefined
    ) {
      return;
    }

    const CARD_VERSION_MAPPING = {
      showNormalCards: 'Normal',
      showAACards: 'Alternative Art',
      showFoilCards: 'Foil',
      showTexturedCards: 'Textured',
      showPreRelease: 'Release',
      showBoxTopper: 'Box Topper',
      showFullArtCards: 'Full Art',
      showStampedCards: 'Stamp',
      showSpecialRareCards: 'Special Rare',
      showRarePullCards: 'Rare Pull',
    };

    const ALL_CARD_VERSIONS = Object.values(CARD_VERSION_MAPPING);

    let filter: IFilter = this.filterStore.filter();

    let newVersionFilter: string[] = [...ALL_CARD_VERSIONS];

    for (const [settingKey, cardVersion] of Object.entries(CARD_VERSION_MAPPING)) {
      // Cast to keyof ISettings for type safety
      const key = settingKey as keyof ISettings;
      if (!settings[key]) {
        // If the setting is false (e.g., !settings.showFoilCards) filter out the card version
        newVersionFilter = newVersionFilter.filter((v) => v !== cardVersion);
      }
    }

    filter = { ...filter, versionFilter: newVersionFilter };

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
