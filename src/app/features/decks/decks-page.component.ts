import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first, Subject, takeUntil, tap } from 'rxjs';
import * as uuid from 'uuid';
import { ICard, IDeck, ITournamentDeck, TAGS } from '../../../models';
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
        <h1
          class="text-shadow mt-6 pb-1 text-4xl font-black text-[#e2e4e6] xl:mt-2"
        >
          {{ this.mode + ' Decks' }}
        </h1>

        <div class="lg:px-auto flex flex-col px-1 lg:flex-row">
          <button
            pButton
            class="p-button-outlined mt-1 lg:mt-3 lg:mr-2"
            icon="pi pi-arrow-right-arrow-left"
            type="button"
            [label]="getSwitchLabel()"
            (click)="switchMode()"
          ></button>

          <button
            pButton
            class="p-button-outlined mt-1 lg:mt-3 lg:mr-2"
            icon="pi pi-chart-line"
            type="button"
            label="Deck Statistics"
            (click)="deckStatsDialog = true; updateStatistics.next(true)"
          ></button>

          <button
            pButton
            class="p-button-outlined mt-1 lg:mt-3"
            icon="pi pi-cloud-upload"
            type="button"
            label="Submit a Tournament Deck"
            (click)="deckSubmissionDialog = true"
          ></button>
        </div>

        <digimon-decks-filter
          [form]="form"
          [mode]="this.mode"
        ></digimon-decks-filter>

        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <digimon-deck-container
            class="mx-auto min-w-[280px] max-w-[285px]"
            *ngFor="let deck of decksToShow"
            (click)="showDeckDetails(deck)"
            (contextmenu)="showDeckDetails(deck)"
            [deck]="deck"
            [mode]="this.mode"
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
        [deck]="selectedDeck"
        [mode]="mode"
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
      <digimon-deck-submission
        (onClose)="deckSubmissionDialog = false"
      ></digimon-deck-submission>
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
  filteredDecks: IDeck[] | ITournamentDeck[] = [];
  decksToShow: IDeck[] | ITournamentDeck[] = [];
  selectedDeck: IDeck | ITournamentDeck = emptyDeck;

  form = new FormGroup({
    searchFilter: new FormControl(''),
    tagFilter: new FormControl([]),
    placementFilter: new FormControl(''),
    formatFilter: new FormControl([]),
    sizeFilter: new FormControl([]),
  });

  tags = TAGS;

  deckDialog = false;
  emptyDeck = emptyDeck;

  deckSubmissionDialog = false;
  deckStatsDialog = false;
  updateStatistics = new Subject<boolean>();

  first = 0;
  page = 0;

  public allCards: ICard[] = [];
  private decks: IDeck[] | ITournamentDeck[] = [];
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
        this.form.get('searchFilter')!.setValue(search);
        this.filterChanges();
      });

    this.form.valueChanges
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

  filterChanges() {
    const formValues = this.form.value;
    this.filteredDecks = this.applySearchFilter(formValues);
    this.filteredDecks = this.applyTagFilter(formValues);
    this.filteredDecks = this.applyPlacementFilter(formValues);
    this.filteredDecks = this.applySizeFilter(formValues);
    this.filteredDecks = this.applyFormatFilter(formValues);

    this.filteredDecks = this.filteredDecks.sort((a, b) => {
      const aTime = new Date(a.date!).getTime();
      const bTime = new Date(b.date!).getTime();
      return bTime - aTime;
    });

    this.first = 0;
    this.page = 0;
    this.decksToShow = this.filteredDecks.slice(0, 20);
  }

  private applySearchFilter(formValues: any): IDeck[] | ITournamentDeck[] {
    if (!formValues.searchFilter) {
      return this.decks;
    }
    return this.decks.filter((deck) => {
      const search = formValues.searchFilter.toLocaleLowerCase();

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

  private applyTagFilter(formValues: any): IDeck[] | ITournamentDeck[] {
    if (formValues.tagFilter.length === 0) {
      return this.filteredDecks;
    }
    return this.filteredDecks.filter((deck) => {
      let isTrue = false;
      deck.tags?.forEach((tag) => {
        isTrue = formValues.tagFilter.includes(tag.name);
      });
      return isTrue;
    });
  }

  private applyPlacementFilter(formValues: any): IDeck[] | ITournamentDeck[] {
    if (!formValues.placementFilter) {
      return this.filteredDecks;
    }
    if (!(this.filteredDecks as unknown as ITournamentDeck[])[0].format) {
      return this.filteredDecks;
    }

    const tournamentDecks: ITournamentDeck[] = this
      .filteredDecks as unknown as ITournamentDeck[];

    return tournamentDecks.filter(
      (deck) => deck.placement === formValues.placementFilter
    );
  }

  private applySizeFilter(formValues: any): IDeck[] | ITournamentDeck[] {
    if (formValues.sizeFilter.length === 0) {
      return this.filteredDecks;
    }
    if (!(this.filteredDecks as unknown as ITournamentDeck[])[0].format) {
      return this.filteredDecks;
    }

    const tournamentDecks: ITournamentDeck[] = this
      .filteredDecks as unknown as ITournamentDeck[];

    return tournamentDecks.filter((deck) => {
      return !!formValues.sizeFilter.find(
        (size: any) => size.value === deck.size
      );
    });
  }

  private applyFormatFilter(formValues: any): IDeck[] | ITournamentDeck[] {
    if (formValues.formatFilter.length === 0) {
      return this.filteredDecks;
    }
    if (!(this.filteredDecks as unknown as ITournamentDeck[])[0].format) {
      return this.filteredDecks;
    }

    const tournamentDecks: ITournamentDeck[] = this
      .filteredDecks as unknown as ITournamentDeck[];

    return tournamentDecks.filter((deck) => {
      return formValues.formatFilter.includes(deck.format);
    });
  }

  getSwitchLabel(): string {
    return this.mode === 'Community'
      ? `Switch to Tournament Decks`
      : `Switch to Community Decks`;
  }

  switchMode() {
    this.mode = this.mode === 'Community' ? 'Tournament' : 'Community';
    if (this.mode === 'Community') {
      this.digimonBackendService
        .getDecks()
        .pipe(first())
        .subscribe((decks) => {
          this.decks = decks;
          this.filteredDecks = this.decks;
          this.decksToShow = this.filteredDecks.slice(0, 20);
          this.filterChanges();
        });
    } else {
      this.digimonBackendService
        .getTournamentDecks()
        .pipe(first())
        .subscribe((decks) => {
          this.decks = decks;
          this.filteredDecks = this.decks;
          this.decksToShow = this.filteredDecks.slice(0, 20);
          this.filterChanges();
        });
    }
  }
}
