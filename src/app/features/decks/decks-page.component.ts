import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BehaviorSubject, combineLatest, filter, first, Observable, Subject, takeUntil, tap } from 'rxjs';
import { ICard, ICountCard, IDeck, ITournamentDeck, TAGS } from '../../../models';
import { IUserAndDecks } from '../../../models/interfaces/userAndDecks.interface';
import { deckIsValid, setDeckImage } from '../../functions/digimon-card.functions';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { selectAllCards, selectCommunityDeckSearch } from '../../store/digimon.selectors';
import { emptyDeck } from '../../store/reducers/digimon.reducers';
import { DeckContainerComponent } from '../shared/deck-container.component';
import { DeckDialogComponent } from '../shared/dialogs/deck-dialog.component';
import { DeckSubmissionComponent } from '../shared/dialogs/deck-submission.component';
import { DeckStatisticsComponent } from './components/deck-statistics.component';
import { DecksFilterComponent } from './components/decks-filter.component';

@Component({
  selector: 'digimon-decks-page',
  template: `
    <div
      class="flex h-[calc(100vh-50px)] w-full flex-col overflow-y-scroll bg-gradient-to-b from-[#17212f] to-[#08528d]">
      <div class="mx-auto w-full max-w-6xl">
        <h1 class="text-shadow mt-6 pb-1 text-4xl font-black text-[#e2e4e6] xl:mt-2">
          {{ this.mode + ' Decks' }}
        </h1>

        <div class="lg:px-auto flex flex-col px-1 lg:flex-row">
          <button
            pButton
            class="p-button-outlined mt-1 lg:mr-2 lg:mt-3"
            icon="pi pi-arrow-right-arrow-left"
            type="button"
            [label]="getSwitchLabel()"
            (click)="switchMode()"></button>

          <button
            pButton
            class="p-button-outlined mt-1 lg:mr-2 lg:mt-3"
            icon="pi pi-chart-line"
            type="button"
            label="Deck Statistics"
            (click)="deckStatsDialog = true; updateStatistics.next(true)"></button>

          <button
            pButton
            class="p-button-outlined mt-1 lg:mt-3"
            icon="pi pi-cloud-upload"
            type="button"
            label="Submit a Tournament Deck"
            (click)="deckSubmissionDialog = true"></button>
        </div>

        <digimon-decks-filter [form]="form" [mode]="this.mode" (filterEmit)="filterChanges()"></digimon-decks-filter>

        <div
          *ngIf="allDecksLoaded$ | async; else loading"
          class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <digimon-deck-container
            class="mx-auto min-w-[280px] max-w-[285px]"
            *ngFor="let deck of decksToShow"
            (click)="showDeckDetails(deck)"
            (contextmenu)="showDeckDetails(deck)"
            [deck]="deck"
            [mode]="this.mode"></digimon-deck-container>
        </div>

        <ng-template #loading>
          <div class="flex w-full"><p-progressSpinner class="mx-auto"></p-progressSpinner></div>
        </ng-template>

        <p-paginator
          (onPageChange)="onPageChange($event)"
          [first]="first"
          [rows]="20"
          [showJumpToPageDropdown]="true"
          [showPageLinks]="false"
          [totalRecords]="filteredDecks.length"
          styleClass="border-0 bg-transparent mx-auto"></p-paginator>
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
        [mode]="mode"
        [editable]="false"
        (closeDialog)="deckDialog = false"></digimon-deck-dialog>
    </p-dialog>

    <p-dialog
      header="Tournament Deck Submission"
      [(visible)]="deckSubmissionDialog"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000">
      <digimon-deck-submission (onClose)="deckSubmissionDialog = false"></digimon-deck-submission>
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
        [allCards]="(allCards$ | async) ?? []"
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
  ],
  providers: [MessageService],
})
export class DecksPageComponent implements OnInit, OnDestroy {
  mode: 'Community' | 'Tournament' = 'Community';
  filteredDecks: IDeck[] | ITournamentDeck[] = [];
  decksToShow: IDeck[] | ITournamentDeck[] = [];
  selectedDeck: IDeck | ITournamentDeck = emptyDeck;

  private decks: IDeck[] | ITournamentDeck[] = [];
  private allDecks: IDeck[] = []; // All decks only loaded once

  form = new UntypedFormGroup({
    searchFilter: new UntypedFormControl(''),
    placementFilter: new UntypedFormControl(''),
    formatFilter: new UntypedFormControl([]),
    sizeFilter: new UntypedFormControl([]),
    tagFilter: new UntypedFormControl(['BT12']),
  });

  tags = TAGS;

  deckDialog = false;
  deckSubmissionDialog = false;
  deckStatsDialog = false;
  updateStatistics = new Subject<boolean>();

  first = 0;
  page = 0;

  users$: Observable<IUserAndDecks[]> = this.digimonBackendService.getUserDecks();
  allCards$: Observable<ICard[]> = this.store.select(selectAllCards);
  deckSearch$: Observable<string> = this.store.select(selectCommunityDeckSearch);
  allDecksLoaded$ = new BehaviorSubject(false);

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

    combineLatest([this.users$, this.allCards$, this.deckSearch$])
      .pipe(
        first(),
        tap(() => this.allDecksLoaded$.next(false))
      )
      .subscribe(([users, allCards, search]) => {
        this.form.get('searchFilter')!.setValue(search);

        let decks: IDeck[] = [];
        users.forEach((user) => {
          user.decks.forEach((deck) => {
            const formattedDeck = deck;
            formattedDeck.user = user.user.user ?? 'Unknown';
            formattedDeck.userId = user.user.uid;
            decks = [...decks, formattedDeck];
          });
        });

        this.allDecks = decks;

        decks = decks
          .filter((deck) => deck.tags.some((tag) => tag.name === 'BT12'))
          .filter((deck) => deckIsValid(deck, allCards) === '')
          .filter((elem, index, self) => {
            return self.slice(index + 1).every((otherElem) => {
              return !this.arraysEqual(elem.cards, otherElem.cards);
            });
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        this.filteredDecks = decks;

        this.setDecksToShow(0, 20);

        this.allDecksLoaded$.next(true);
      });
  }

  arraysEqual(a: ICountCard[], b: ICountCard[]): boolean {
    return a.length === b.length && a.every((val) => b.includes(val));
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  showDeckDetails(deck: IDeck) {
    this.selectedDeck = deck;
    this.deckDialog = true;
  }

  onPageChange(event: any, slice?: number) {
    this.first = event.first;
    this.page = event.page;
    this.setDecksToShow(event.first, (slice ?? 20) * (event.page + 1));
  }

  private setDecksToShow(from: number, to: number) {
    this.decksToShow = this.filteredDecks.slice(from, to).map((deck: IDeck | ITournamentDeck) => ({
      ...deck,
      imageCardId: deck.imageCardId === 'BT1-001' ? setDeckImage(deck).id : deck.imageCardId,
    }));
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

  filterChanges() {
    this.allDecksLoaded$.next(false);
    this.updateTag(this.form.get('tagFilter')!.value)
      .pipe(first())
      .subscribe(() => this.allDecksLoaded$.next(true));
  }

  updateTag(tagFilter: string[]) {
    return this.allCards$.pipe(
      tap((allCards) => {
        let decks: IDeck[] = this.allDecks;

        if (tagFilter.length > 0) {
          decks = decks.filter((deck) => tagFilter.includes(deck.tags[0].name));
        }

        decks = decks
          .filter((deck) => deckIsValid(deck, allCards) === '')
          .filter((elem, index, self) => {
            return self.slice(index + 1).every((otherElem) => {
              return !this.arraysEqual(elem.cards, otherElem.cards);
            });
          });

        this.filteredDecks = decks;

        const formValues = this.form.value;
        this.filteredDecks = this.applySearchFilter(formValues);
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
      })
    );
  }

  private applySearchFilter(formValues: any): IDeck[] | ITournamentDeck[] {
    if (!formValues.searchFilter) {
      return this.filteredDecks;
    }
    return this.filteredDecks.filter((deck) => {
      const search = formValues.searchFilter.toLocaleLowerCase();

      const titleInText = deck.title?.toLocaleLowerCase().includes(search) ?? false;
      const descriptionInText = deck.description?.toLocaleLowerCase().includes(search) ?? false;
      const userInText = deck.user?.toLocaleLowerCase().includes(search) ?? false;
      const cardsInText = deck.cards.filter((card) => card.id.toLocaleLowerCase().includes(search)).length > 0;
      const colorInText = deck.color?.name.toLocaleLowerCase().includes(search) ?? false;

      return titleInText || descriptionInText || userInText || cardsInText || colorInText;
    });
  }

  private applyPlacementFilter(formValues: any): IDeck[] | ITournamentDeck[] {
    if (!formValues.placementFilter) {
      return this.filteredDecks;
    }
    if (!(this.filteredDecks as unknown as ITournamentDeck[])[0].format) {
      return this.filteredDecks;
    }

    const tournamentDecks: ITournamentDeck[] = this.filteredDecks as unknown as ITournamentDeck[];

    return tournamentDecks.filter((deck) => deck.placement === formValues.placementFilter);
  }

  private applySizeFilter(formValues: any): IDeck[] | ITournamentDeck[] {
    if (formValues.sizeFilter.length === 0) {
      return this.filteredDecks;
    }
    if (!(this.filteredDecks as unknown as ITournamentDeck[])[0].format) {
      return this.filteredDecks;
    }

    const tournamentDecks: ITournamentDeck[] = this.filteredDecks as unknown as ITournamentDeck[];

    return tournamentDecks.filter((deck) => {
      return !!formValues.sizeFilter.find((size: any) => size.value === deck.size);
    });
  }

  private applyFormatFilter(formValues: any): IDeck[] | ITournamentDeck[] {
    if (formValues.formatFilter.length === 0) {
      return this.filteredDecks;
    }
    if (!(this.filteredDecks as unknown as ITournamentDeck[])[0].format) {
      return this.filteredDecks;
    }

    const tournamentDecks: ITournamentDeck[] = this.filteredDecks as unknown as ITournamentDeck[];

    return tournamentDecks.filter((deck) => {
      return formValues.formatFilter.includes(deck.format);
    });
  }

  getSwitchLabel(): string {
    return this.mode === 'Community' ? `Switch to Tournament Decks` : `Switch to Community Decks`;
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
