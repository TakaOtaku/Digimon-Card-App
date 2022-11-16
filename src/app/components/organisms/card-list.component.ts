import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { englishCards } from '../../../assets/cardlists/eng/english';
import { ICard, ICountCard } from '../../../models';
import {
  selectCollection,
  selectCollectionMode,
  selectFilteredCards,
} from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-card-list',
  template: `
    <div class="flex flex-wrap justify-center overflow-hidden">
      <h1
        *ngIf="cardsToShow.length === 0"
        class="primary-color text-bold my-10 text-5xl"
      >
        No cards found!
      </h1>

      <div class="flex w-full flex-row flex-wrap">
        <digimon-full-card
          *ngFor="let card of cardsToShow"
          (viewCard)="viewCard($event)"
          [card]="card"
          [collectionMode]="collectionMode"
          [count]="getCount(card.id)"
          [deckView]="true"
          [deckBuilder]="true"
          class="flex-[1 1 25%] max-w-[25%] scale-95 transition"
        >
        </digimon-full-card>
      </div>

      <button
        *ngIf="moreCardsThere()"
        (click)="showMore()"
        class="min-w-auto primary-background mt-2 mt-2 h-8 w-full rounded p-2 text-xs font-semibold text-white"
      >
        Show more...
      </button>
    </div>

    <p-dialog
      (close)="viewCardDialog = false"
      [(visible)]="viewCardDialog"
      [baseZIndex]="100000"
      [showHeader]="false"
      class="overflow-x-hidden"
    >
      <digimon-view-card-dialog
        (onClose)="viewCardDialog = false"
        [card]="card"
      ></digimon-view-card-dialog>
    </p-dialog>
  `,
})
export class CardListComponent implements OnInit, OnDestroy {
  @Input() public showCount: number;

  viewCardDialog = false;
  card = englishCards[0];

  cards: ICard[] = [];
  cardsToShow: ICard[] = [];

  collectionMode = true;

  private collection: ICountCard[] = [];

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.storeSubscriptions();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  /**
   * All Store Subscriptions.
   *
   * Check if the DeckBuilder-Mode should be used.
   *
   * Use either only Normal Cards in Deckbuilder-Mode or all Cards.
   *
   * Slice the Cards based on the Show Count.
   *
   * Check if Collection Mode is turned on.
   */
  storeSubscriptions() {
    this.store
      .select(selectFilteredCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cards) => {
        this.cards = cards;
        this.cardsToShow = this.cards.slice(0, this.showCount);
      });

    this.store
      .select(selectCollection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collection) => {
        this.collection = collection;
      });

    this.store
      .select(selectCollectionMode)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collectionMode) => (this.collectionMode = collectionMode));
  }

  /**
   * Search the user collection for the number and return the count
   */
  getCount(cardId: string): number {
    if (this.collection === null) {
      return 0;
    }
    return this.collection.find((value) => value.id === cardId)?.count ?? 0;
  }

  /**
   * Show more cards based on the @Input showCount
   */
  showMore() {
    const length = this.cardsToShow.length;
    this.cardsToShow = this.cards.slice(0, length + this.showCount!);
  }

  /**
   * Check if there are more Cards to show, which aren't shown right now
   */
  moreCardsThere(): boolean {
    return (
      this.cards.length > this.cardsToShow.length && this.cardsToShow.length > 0
    );
  }

  viewCard(card: ICard) {
    this.viewCardDialog = true;
    this.card = card;
  }
}
