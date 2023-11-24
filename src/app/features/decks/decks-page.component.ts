import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { combineLatest, filter, Subject, tap } from 'rxjs';

import {
  DigimonCard,
  ICountCard,
  IDeck,
  ITournamentDeck,
} from '../../../models';
import { setDeckImage } from '../../functions/digimon-card.functions';
import { WebsiteActions } from '../../store/digimon.actions';
import {
  selectAllCards,
  selectCollection,
  selectCommunityDecks,
  selectCommunityDeckSearch,
} from '../../store/digimon.selectors';
import { emptyDeck } from '../../store/reducers/digimon.reducers';
import { DeckContainerComponent } from '../shared/deck-container.component';
import { DeckDialogComponent } from '../shared/dialogs/deck-dialog.component';
import { DeckSubmissionComponent } from '../shared/dialogs/deck-submission.component';
import { DeckStatisticsComponent } from './components/deck-statistics.component';
import { DecksFilterComponent } from './components/decks-filter.component';
import { TierlistComponent } from './components/tierlist.component';

@Component({
  selector: 'digimon-decks-page',
  template: `
    <div
      class="relative flex h-[100vh] w-[calc(100vw-6.5rem)] flex-row overflow-y-scroll bg-gradient-to-b from-[#17212f] to-[#08528d]">
      <div class="mx-auto w-full max-w-6xl">
        <h1
          class="text-shadow mt-6 pb-1 text-4xl font-black text-[#e2e4e6] xl:mt-2">
          Community Decks
        </h1>

        <div class="lg:px-auto flex flex-col px-1 lg:flex-row">
          <button
            pButton
            class="p-button-outlined mt-1 lg:mr-2 lg:mt-3"
            icon="pi pi-search"
            type="button"
            label="Find possible decks within your collection"
            (click)="applyCollectionFilter()"></button>

          <button
            pButton
            class="p-button-outlined ml-auto mt-1 lg:mr-2 lg:mt-3"
            icon="pi pi-chart-line"
            type="button"
            label="Deck Statistics"
            (click)="
              deckStatsDialog = true; updateStatistics.next(true)
            "></button>
        </div>

        <digimon-decks-filter
          [form]="form"
          (applyFilter)="filterChanges()"></digimon-decks-filter>

        <div
          *ngIf="decks$ | async; else loading"
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
          (onPageChange)="onPageChange($event)"
          [first]="first"
          [rows]="rows"
          [showJumpToPageDropdown]="true"
          [showPageLinks]="false"
          [totalRecords]="filteredDecks.length"
          styleClass="border-0 bg-transparent mx-auto"></p-paginator>

        <p-divider></p-divider>

        <digimon-tierlist></digimon-tierlist>
      </div>
    </div>

    <p-dialog
      header="Deck Details"
      [(visible)]="deckDialog"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000">
      <digimon-deck-dialog
        [deck]="selectedDeck"
        [editable]="false"
        (closeDialog)="deckDialog = false"></digimon-deck-dialog>
    </p-dialog>

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
        [allCards]="allCards"
        [updateCards]="updateStatistics"></digimon-deck-statistics>
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
  ],
  providers: [MessageService],
})
export class DecksPageComponent implements OnInit {
  selectedDeck: IDeck = emptyDeck;

  form = new UntypedFormGroup({
    searchFilter: new UntypedFormControl(''),
    tagFilter: new UntypedFormControl([]),
  });

  deckDialog = false;
  deckSubmissionDialog = false;
  deckStatsDialog = false;
  updateStatistics = new Subject<boolean>();

  decksToShow: IDeck[] = [];
  first = 0;
  page = 0;
  rows = 20;
  decks: IDeck[] = [];
  filteredDecks: IDeck[] = [];
  allCards: DigimonCard[];
  collection: ICountCard[];
  private store = inject(Store);
  decks$ = combineLatest([
    this.store.select(selectCommunityDecks),
    this.store.select(selectCommunityDeckSearch),
    this.store.select(selectAllCards),
    this.store.select(selectCollection),
  ]).pipe(
    filter(([decks, search, allCards, collection]) => decks.length > 0),
    tap(([decks, search, allCards, collection]) => {
      this.decks = decks;
      this.filteredDecks = decks;
      this.allCards = allCards;
      this.collection = collection;

      this.form.get('searchFilter')?.setValue(search);
      this.filteredDecks = this.applySearchFilter(search);
      this.setDecksToShow(0, this.rows);
    }),
  );
  private meta = inject(Meta);
  private title = inject(Title);

  ngOnInit(): void {
    this.makeGoogleFriendly();
    this.store.dispatch(WebsiteActions.loadCommunityDecks());
  }

  showDeckDetails(deck: IDeck) {
    this.selectedDeck = deck;
    this.deckDialog = true;
  }

  onPageChange(event: any, slice?: number) {
    this.first = event.first;
    this.page = event.page;
    this.setDecksToShow(event.first, (slice ?? this.rows) * (event.page + 1));
  }

  applyCollectionFilter() {
    const decksThatCanBeCreatedWithCollection = this.filteredDecks.filter(
      (deck) => {
        return deck.cards.every((cardNeededForDeck) => {
          const matchingCards = this.collection.filter(
            (card) =>
              card.id.split('_', 1)[0] ===
              cardNeededForDeck.id.split('_', 1)[0],
          );
          const totalCount = matchingCards.reduce(
            (total, card) => total + card.count,
            0,
          );
          return totalCount >= cardNeededForDeck.count;
        });
      },
    );

    this.filteredDecks = decksThatCanBeCreatedWithCollection;
    this.setDecksToShow(0, this.rows);
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
            ? setDeckImage(deck, this.allCards).id
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
