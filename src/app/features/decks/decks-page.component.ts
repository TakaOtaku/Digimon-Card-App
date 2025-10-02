import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { setDeckImage } from '@functions';
import { emptyDeck, ICountCard, IDeck } from '@models';
import { DialogStore, DigimonCardStore, SaveStore, WebsiteStore } from '@store';
import { ToastrService } from 'ngx-toastr';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { DeckContainerComponent } from '../shared/deck-container.component';
import { PageComponent } from '../shared/page.component';
import { PaginationComponent } from '../shared/pagination.component';
import { DeckFilterComponent } from '../shared/deck-filter.component';
import { IDeckFilter } from '../../services/mongo-backend.service';
import { DeckStatisticsComponent } from './components/deck-statistics.component';
import { TierlistComponent } from './components/tierlist.component';

@Component({
  selector: 'digimon-decks-page',
  template: `
    <digimon-page #page>
      <p-blockUI [blocked]="loading2" [target]="page">
        <p-progressSpinner class="mx-auto"></p-progressSpinner>
      </p-blockUI>
      <div class="mx-auto self-baseline px-5 w-full max-w-7xl">
        <div class="lg:px-auto flex px-1 flex-col md:flex-row items-baseline">
          <h1 class="text-shadow mt-6 pb-1 text-2xl md:text-4xl font-black text-[#e2e4e6]">Community Decks</h1>

          <div class="md:ml-auto pb-2">
            <p-button
              size="small"
              class="p-button-outlined"
              styleClass="primary-background text-white border-none"
              icon="pi pi-chart-line"
              type="button"
              label="Statistics"
              (click)="deckStatsDialog = true; updateStatistics.next(true)"></p-button>
          </div>
        </div>

        <!-- Deck Filter Component -->
        <digimon-deck-filter
          [filter]="websiteStore.decksFilter()"
          (filterChange)="onFilterChange($event)">
        </digimon-deck-filter>

        <!-- Loading State -->
        <div *ngIf="websiteStore.isLoadingDecks()" class="flex w-full justify-center py-8">
          <p-progressSpinner class="mx-auto"></p-progressSpinner>
        </div>

        <!-- Initial State - No Search Yet -->
        <div *ngIf="!websiteStore.isLoadingDecks() && websiteStore.communityDecks().length === 0 && !hasSearched()" class="text-center py-12">
          <div class="max-w-md mx-auto">
            <i class="pi pi-search text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">Search for Decks</h3>
            <p class="text-gray-500">Enter a search term above to browse community decks. Search by deck name, user, card IDs, or colors.</p>
          </div>
        </div>

        <!-- Deck Results -->
        <div *ngIf="!websiteStore.isLoadingDecks() && websiteStore.communityDecks().length > 0" class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-1 mt-2">
          <digimon-deck-container
            class="mx-auto min-w-[280px] max-w-[285px]"
            *ngFor="let deck of websiteStore.communityDecks()"
            (click)="showDeckDetails(deck)"
            (contextmenu)="showDeckDetails(deck)"
            [deck]="deck"></digimon-deck-container>
        </div>

        <!-- No Results After Search -->
        <div *ngIf="!websiteStore.isLoadingDecks() && websiteStore.communityDecks().length === 0 && hasSearched()" class="text-center py-8">
          <i class="pi pi-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-500">No decks found matching your search criteria.</p>
          <p class="text-sm text-gray-400 mt-2">Try different keywords or clear your search to browse all decks.</p>
        </div>

        <!-- New Pagination Component -->
        <digimon-pagination
          *ngIf="!websiteStore.isLoadingDecks() && websiteStore.communityDecks().length > 0"
          [pagination]="websiteStore.decksPagination()"
          (pageChange)="onPageChange($event)">
        </digimon-pagination>

        <p-divider></p-divider>

        <digimon-tierlist></digimon-tierlist>
      </div>
    </digimon-page>

    <p-dialog
      header="Deck Statistics for the filtered decks"
      [(visible)]="deckStatsDialog"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000">
      <digimon-deck-statistics [decks]="filteredDecks" [updateCards]="updateStatistics" [(loading)]="loading2"></digimon-deck-statistics>
    </p-dialog>
  `,
  standalone: true,
  imports: [
    ButtonModule,
    NgFor,
    DeckContainerComponent,
    PaginatorModule,
    DialogModule,
    DeckStatisticsComponent,
    NgIf,
    ProgressSpinnerModule,
    TierlistComponent,
    DividerModule,
    PageComponent,
    TooltipModule,
    BlockUIModule,
    PaginationComponent,
    DeckFilterComponent,
  ],
  providers: [],
})
export class DecksPageComponent implements OnInit {
  saveStore = inject(SaveStore);
  dialogStore = inject(DialogStore);
  websiteStore = inject(WebsiteStore);
  selectedDeck: IDeck = emptyDeck;
  deckDialog = false;
  deckStatsDialog = false;
  updateStatistics = new Subject<boolean>();
  decks: IDeck[] = [];
  filteredDecks: IDeck[] = [];
  collection: ICountCard[];
  loading2 = false;
  private searchPerformed = false;
  private meta = inject(Meta);
  private title = inject(Title);
  private toastrService = inject(ToastrService);
  private digimonCardStore = inject(DigimonCardStore);

  constructor(private changeDetection: ChangeDetectorRef) {
    // Don't load decks automatically - wait for user to search

    effect(() => {
      const decks = this.websiteStore.communityDecks();

      // Store current decks for collection filtering
      this.decks = decks;
      this.filteredDecks = decks;
      this.collection = this.saveStore.collection();

      this.changeDetection.detectChanges();
    });
  }

  ngOnInit(): void {
    this.makeGoogleFriendly();
  }

  showDeckDetails(deck: IDeck) {
    this.dialogStore.updateDeckDialog({
      show: true,
      editable: false,
      deck,
    });
    this.selectedDeck = deck;
    this.deckDialog = true;
  }

  applyCollectionFilter() {
    this.loading2 = true;

    const collectionCounts: { [cardId: string]: number } = {};

    // Populate the collectionCounts map
    this.collection.forEach((card) => {
      const cardId = card.id.split('_', 1)[0];
      collectionCounts[cardId] = (collectionCounts[cardId] || 0) + card.count;
    });

    // Filter current decks based on collection
    const possibleDecks = this.filteredDecks.filter((deck) => {
      return deck.cards.every((cardNeededForDeck) => {
        const totalCount = collectionCounts[cardNeededForDeck.id.split('_', 1)[0]] || 0;
        return totalCount >= cardNeededForDeck.count;
      });
    });

    // Update the filtered decks display
    this.filteredDecks = possibleDecks;

    this.toastrService.success('Filtered for Decks possible with your cards', 'Success');

    this.loading2 = false;
  }

  // Filter and pagination methods
  onFilterChange(filter: IDeckFilter) {
    this.searchPerformed = true;
    this.websiteStore.loadCommunityDecksWithFilter(filter);
  }

  onPageChange(page: number) {
    this.websiteStore.loadDecksPage(page);
  }

  hasSearched(): boolean {
    return this.searchPerformed;
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Community');

    this.meta.addTags([
      {
        name: 'description',
        content: 'Meta decks, fun decks, tournament decks and many more, find new decks for every set.',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content: 'Meta, decks, tournament, fun',
      },
    ]);
  }
}
