import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, effect, HostListener, inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { emptyDeck, ICountCard, IDeck, ITournamentDeck } from '../../../models';
import { setDeckImage } from '../../functions';
import { DialogStore } from '../../store/dialog.store';
import { DigimonCardStore } from '../../store/digimon-card.store';
import { SaveStore } from '../../store/save.store';
import { WebsiteStore } from '../../store/website.store';
import { DeckContainerComponent } from '../shared/deck-container.component';
import { DeckDialogComponent } from '../shared/dialogs/deck-dialog.component';
import { DeckSubmissionComponent } from '../shared/dialogs/deck-submission.component';
import { PageComponent } from '../shared/page.component';
import { DeckStatisticsComponent } from './components/deck-statistics.component';
import { DecksFilterComponent } from './components/decks-filter.component';
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
          <h1
            class="text-shadow mt-6 pb-1 text-2xl md:text-4xl font-black text-[#e2e4e6]">
            Community Decks
          </h1>

          <div class="md:ml-auto">
            <p-button
              size="small"
              class="p-button-outlined mr-1"
              icon="pi pi-search"
              type="button"
              pTooltip="Filter the Decks for Decks possible with your cards"
              label="Possible Decks"
              (click)="applyCollectionFilter()"></p-button>

            <p-button
              size="small"
              class="p-button-outlined"
              icon="pi pi-chart-line"
              type="button"
              label="Statistics"
              (click)="
                deckStatsDialog = true; updateStatistics.next(true)
              "></p-button>
          </div>
        </div>

        <digimon-decks-filter
          [form]="form"
          (applyFilter)="filterChanges()"></digimon-decks-filter>

        <div
          *ngIf="decksToShow.length > 0; else loading"
          class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <digimon-deck-container
            class="mx-auto min-w-[280px] max-w-[285px]"
            *ngFor="let deck of decksToShow"
            (click)="showDeckDetails(deck)"
            (contextmenu)="showDeckDetails(deck)"
            [deck]="deck"></digimon-deck-container>
        </div>

        <ng-template #loading>
          <div class="flex w-full">
            <p-progressSpinner class="mx-auto"></p-progressSpinner>
          </div>
        </ng-template>

        <p-paginator
          class="w-full h-8 surface-ground"
          (onPageChange)="onPageChange($event)"
          [first]="first"
          [rows]="rows"
          [showJumpToPageDropdown]="true"
          [showPageLinks]="false"
          [totalRecords]="filteredDecks.length"
          styleClass="surface-ground p-0 mx-auto"></p-paginator>

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
      <digimon-deck-statistics
        [decks]="filteredDecks"
        [updateCards]="updateStatistics"
        [(loading)]="loading2"></digimon-deck-statistics>
    </p-dialog>
  `,
  standalone: true,
  imports: [
    ButtonModule,
    DecksFilterComponent,
    NgFor,
    DeckContainerComponent,
    PaginatorModule,
    DialogModule,
    DeckDialogComponent,
    DeckSubmissionComponent,
    DeckStatisticsComponent,
    NgIf,
    AsyncPipe,
    ProgressSpinnerModule,
    TierlistComponent,
    DividerModule,
    PageComponent,
    TooltipModule,
    BlockUIModule,
  ],
  providers: [],
})
export class DecksPageComponent implements OnInit {
  private meta = inject(Meta);
  private title = inject(Title);
  private toastrService = inject(ToastrService);

  saveStore = inject(SaveStore);
  dialogStore = inject(DialogStore);
  websiteStore = inject(WebsiteStore);

  selectedDeck: IDeck = emptyDeck;

  form = new UntypedFormGroup({
    searchFilter: new UntypedFormControl(''),
    tagFilter: new UntypedFormControl([]),
  });

  deckDialog = false;
  deckStatsDialog = false;
  updateStatistics = new Subject<boolean>();

  decksToShow: IDeck[] = [];
  first = 0;
  page = 0;
  rows = 20;
  decks: IDeck[] = [];
  filteredDecks: IDeck[] = [];
  collection: ICountCard[];

  loading2 = false;

  private digimonCardStore = inject(DigimonCardStore);

  constructor(private changeDetection: ChangeDetectorRef) {
    this.websiteStore.loadCommunityDecks();

    effect(() => {
      const decks = this.websiteStore.communityDecks();
      const search = this.websiteStore.communityDeckSearch();
      if (decks.length === 0) return;

      this.decks = decks;

      this.filteredDecks = decks;
      this.collection = this.saveStore.collection();

      this.form.get('searchFilter')?.setValue(search);
      this.filteredDecks = this.applySearchFilter(search);
      this.setDecksToShow(0, this.rows);
      this.changeDetection.detectChanges();
    });
  }

  ngOnInit(): void {
    this.checkScreenWidth(window.innerWidth);

    this.makeGoogleFriendly();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenWidth((event.target as Window).innerWidth);
  }

  private checkScreenWidth(innerWidth: number) {
    const lg = innerWidth >= 1024;
    const md = innerWidth >= 768;
    if (lg) {
      this.rows = 20;
    } else if (md) {
      this.rows = 10;
    } else {
      this.rows = 5;
    }
    this.setDecksToShow(0, this.rows);
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

  onPageChange(event: any, slice?: number) {
    this.first = event.first;
    this.page = event.page;
    this.setDecksToShow(event.first, (slice ?? this.rows) * (event.page + 1));
  }

  applyCollectionFilter() {
    this.loading2 = true;

    const collectionCounts: { [cardId: string]: number } = {};

    // Populate the collectionCounts map
    this.collection.forEach((card) => {
      const cardId = card.id.split('_', 1)[0];
      collectionCounts[cardId] = (collectionCounts[cardId] || 0) + card.count;
    });

    this.filteredDecks = this.filteredDecks.filter((deck) => {
      return deck.cards.every((cardNeededForDeck) => {
        const totalCount =
          collectionCounts[cardNeededForDeck.id.split('_', 1)[0]] || 0;
        return totalCount >= cardNeededForDeck.count;
      });
    });
    this.setDecksToShow(0, this.rows);

    this.toastrService.success(
      'Filtered for Decks possible with your cards',
      'Success',
    );

    this.loading2 = false;
  }

  filterChanges() {
    this.filteredDecks = this.decks;
    this.filteredDecks = this.applySearchFilter(
      this.form.get('searchFilter')!.value,
    );
    this.filteredDecks = this.applyTagFilter(this.form.get('tagFilter')!.value);
    this.setDecksToShow(0, this.rows);
  }

  private setDecksToShow(from: number, to: number) {
    this.decksToShow = this.filteredDecks
      .slice(from, to)
      .map((deck: IDeck | ITournamentDeck) => ({
        ...deck,
        imageCardId:
          deck.imageCardId === 'BT1-001'
            ? setDeckImage(deck, this.digimonCardStore.cards()).id
            : deck.imageCardId,
      }));
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Community');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Meta decks, fun decks, tournament decks and many more, find new decks for every set.',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content: 'Meta, decks, tournament, fun',
      },
    ]);
  }

  private applySearchFilter(searchValue: string): IDeck[] {
    if (!searchValue || searchValue === '') {
      return this.filteredDecks;
    }
    return this.filteredDecks.filter((deck) => {
      const search = searchValue.toLocaleLowerCase();

      const titleInText =
        deck.title?.toLocaleLowerCase().includes(search) ?? false;
      const descriptionInText =
        deck.description?.toLocaleLowerCase().includes(search) ?? false;
      const userInText =
        deck.user?.toLocaleLowerCase().includes(search) ?? false;
      const cardsInText =
        deck.cards.filter((card) =>
          card.id.toLocaleLowerCase().includes(search),
        ).length > 0;
      const colorInText =
        deck.color?.name.toLocaleLowerCase().includes(search) ?? false;

      return (
        titleInText ||
        descriptionInText ||
        userInText ||
        cardsInText ||
        colorInText
      );
    });
  }

  private applyTagFilter(tagValues: string[]): IDeck[] {
    if (!tagValues || tagValues.length === 0) {
      return this.filteredDecks;
    }
    return this.filteredDecks.filter((deck) =>
      deck.tags.some((tag) => tagValues.includes(tag.name)),
    );
  }
}
