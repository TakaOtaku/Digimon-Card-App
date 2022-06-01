import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { englishCards } from '../../../../assets/cardlists/eng/english';
import { ICard, ICountCard } from '../../../../models';
import { SITES } from '../../../pages/main-page/main-page.component';
import {
  selectCollection,
  selectCollectionMode,
  selectFilteredCards,
  selectSite,
} from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-card-list',
  templateUrl: './card-list.component.html',
})
export class CardListComponent implements OnInit, OnDestroy {
  @Input() public showCount: number;

  @Output() onCardClick = new EventEmitter<string>();

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

  /**
   * Only in DeckBuilder-Mode add the clicked card to the current Deck
   */
  addToDeck(cardId: string) {
    this.onCardClick.emit(cardId);
  }
}
