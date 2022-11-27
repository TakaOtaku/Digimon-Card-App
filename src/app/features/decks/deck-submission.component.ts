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
  selector: 'digimon-deck-submission',
  template: `
    <div
      class="flex h-[calc(100vh-50px)] w-full flex-col overflow-y-scroll bg-gradient-to-b from-[#17212f] to-[#08528d]"
    ></div>
  `,
})
export class DeckSubmissionComponent implements OnInit, OnDestroy {
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
