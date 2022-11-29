import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { ICard, IDeck, TAGS } from '../../../models';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { importDeck } from '../../store/digimon.actions';
import {
  selectAllCards,
  selectCommunityDecks,
  selectCommunityDeckSearch,
} from '../../store/digimon.selectors';
import { emptyDeck } from '../../store/reducers/digimon.reducers';

@Component({
  selector: 'digimon-decks-page',
  template: `
    <div
      class="flex h-[calc(100vh-50px)] w-full flex-col overflow-y-scroll bg-gradient-to-b from-[#17212f] to-[#08528d]"
    >
      <div class="mx-auto w-full max-w-6xl">
        <div class="flex flex-row">
          <button>
            <h1
              [ngClass]="{ 'text-[#64B5F6]': mode === 'Community' }"
              (click)="mode = 'Community'"
              class="raise-xs surface-card text-shadow mt-6 border border-slate-200 p-1 text-4xl font-black text-[#e2e4e6] transition-all xl:mt-2"
            >
              Community Decks
            </h1>
          </button>

          <button
            pButton
            class="p-button-outlined p-button-rounded mt-3 ml-1"
            icon="pi pi-chart-line"
            type="button"
            (click)="deckStatsDialog = true; updateStatistics.next(true)"
          ></button>

          <button
            pButton
            class="p-button-outlined p-button-rounded mt-3 ml-1"
            icon="pi pi-chart-line"
            type="button"
            label="Submit Tournament Deck"
            (click)="deckSubmissionDialog = true"
          ></button>

          <button class="ml-auto">
            <h1
              [ngClass]="{ 'text-[#64B5F6]': mode === 'Tournament' }"
              (click)="mode = 'Tournament'"
              class="raise-xs surface-card text-shadow mt-6 border border-slate-200 p-1 text-4xl font-black text-[#e2e4e6] transition-all xl:mt-2"
            >
              Tournament Decks
            </h1>
          </button>
        </div>

        <digimon-decks-filter
          [searchFilter]="searchFilter"
          [tagFilter]="tagFilter"
        ></digimon-decks-filter>

        <div class="grid grid-cols-4 gap-2">
          <digimon-deck-container
            *ngFor="let deck of decksToShow"
            (click)="showDeckDetails(deck)"
            (contextmenu)="showDeckDetails(deck)"
            [deck]="deck"
            [community]="true"
          ></digimon-deck-container>
        </div>

        <p-paginator
          (onPageChange)="onPageChange($event)"
          [first]="first"
          [rows]="20"
          [showJumpToPageDropdown]="true"
          [showPageLinks]="false"
          [totalRecords]="filteredDecks.length"
          styleClass="border-0 bg-transparent mx-auto"
        ></p-paginator>
      </div>
    </div>

    <p-dialog
      header="Deck Details"
      [(visible)]="deckDialog"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000"
    >
      <digimon-deck-dialog
        [deck]="selectedDeck ?? emptyDeck"
        [editable]="false"
        (closeDialog)="deckDialog = false"
      ></digimon-deck-dialog>
    </p-dialog>

    <p-dialog
      header="Tournament Deck Submission"
      [(visible)]="deckSubmissionDialog"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000"
    >
      <digimon-deck-submission></digimon-deck-submission>
    </p-dialog>

    <p-dialog
      header="Deck Statistics for the filtered decks"
      [(visible)]="deckStatsDialog"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000"
    >
      <digimon-deck-statistics
        [decks]="filteredDecks"
        [allCards]="allCards"
        [updateCards]="updateStatistics"
      ></digimon-deck-statistics>
    </p-dialog>
  `,
})
export class DecksPageComponent implements OnInit, OnDestroy {
  mode: 'Community' | 'Tournament' = 'Community';
  filteredDecks: IDeck[] = [];
  decksToShow: IDeck[] = [];
  selectedDeck: IDeck;

  searchFilter = new FormControl('');
  tagFilter = new FormControl([]);

  tags = TAGS;

  deckDialog = false;
  emptyDeck = emptyDeck;

  deckSubmissionDialog = false;
  deckStatsDialog = false;
  updateStatistics = new Subject<boolean>();

  first = 0;
  page = 0;

  public allCards: ICard[] = [];
  private decks: IDeck[] = [];
  private allDecks: IDeck[] = [];

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private store: Store,
    private router: Router,
    private digimonBackendService: DigimonBackendService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.makeGoogleFriendly();

    this.store
      .select(selectCommunityDecks)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((decks) => {
        this.allDecks = [...decks].sort((a, b) => {
          const aTime = new Date(a.date!).getTime();
          const bTime = new Date(b.date!).getTime();
          return bTime - aTime;
        });
        this.decks = this.allDecks;
        this.filteredDecks = this.decks;
        this.decksToShow = this.filteredDecks.slice(0, 20);
        this.filterChanges();
      });
    this.store
      .select(selectAllCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allCards) => (this.allCards = allCards));

    this.store
      .select(selectCommunityDeckSearch)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((search) => {
        this.searchFilter.setValue(search);
        this.filterChanges();
      });

    this.searchFilter.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.filterChanges());
    this.tagFilter.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.filterChanges());
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  copyDeck(deck: IDeck) {
    this.confirmationService.confirm({
      message: 'You are about to copy this deck. Are you sure?',
      accept: () => {
        this.store.dispatch(
          importDeck({
            deck: { ...deck, id: uuid.v4() },
          })
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Deck copied!',
          detail: 'Deck was copied successfully!',
        });
      },
    });
  }

  filterChanges() {
    this.filteredDecks = this.searchFilter.value
      ? this.applySearchFilter()
      : this.decks;
    this.filteredDecks =
      this.tagFilter.value.length > 0
        ? this.applyTagFilter()
        : this.filteredDecks;
    this.filteredDecks = this.filteredDecks.sort((a, b) => {
      const aTime = new Date(a.date!).getTime();
      const bTime = new Date(b.date!).getTime();
      return bTime - aTime;
    });

    this.first = 0;
    this.page = 0;
    this.decksToShow = this.filteredDecks.slice(0, 20);
  }

  showDeckDetails(deck: IDeck) {
    this.selectedDeck = deck;
    this.deckDialog = true;
  }

  onPageChange(event: any, slice?: number) {
    this.first = event.first;
    this.page = event.page;
    this.decksToShow = this.filteredDecks.slice(
      event.first,
      (slice ?? 20) * (event.page + 1)
    );
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

  private applySearchFilter(): IDeck[] {
    return this.decks.filter((deck) => {
      const search = this.searchFilter.value.toLocaleLowerCase();

      const titleInText =
        deck.title?.toLocaleLowerCase().includes(search) ?? false;
      const descriptionInText =
        deck.description?.toLocaleLowerCase().includes(search) ?? false;
      const userInText =
        deck.user?.toLocaleLowerCase().includes(search) ?? false;
      const cardsInText =
        deck.cards.filter((card) =>
          card.id.toLocaleLowerCase().includes(search)
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

  private applyTagFilter(): IDeck[] {
    return this.decks.filter((deck) => {
      let isTrue = false;
      deck.tags?.forEach((tag) => {
        isTrue = this.tagFilter.value.includes(tag.name);
      });
      return isTrue;
    });
  }
}
