import {Component, EventEmitter, Input, OnDestroy, OnInit, Output,} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import {ICard, ICountCard} from '../../../../models';
import {changeCollectionMode} from '../../../store/digimon.actions';
import {selectCollection, selectCollectionMode, selectFilteredCards,} from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-pagination-card-list',
  templateUrl: './pagination-card-list.component.html',
  styleUrls: ['./pagination-card-list.component.scss'],
})
export class PaginationCardListComponent implements OnInit, OnDestroy {
  @Input() deckView: boolean;
  @Output() onCardClick = new EventEmitter<string>();

  first = 0;
  page = 0;

  cards: ICard[] = [];
  cardsToShow: ICard[] = [];

  cardsPerRow = 8;

  cardsPerPage = 48;

  filterBox = false;

  private collection: ICountCard[] = [];
  collectionMode = new FormControl();

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select(selectFilteredCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cards) => {
        this.cards = cards;
        this.cardsToShow = cards.slice(0, this.cardsPerPage);
      });

    this.store
      .select(selectCollection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collection) => (this.collection = collection));

    this.store
      .select(selectCollectionMode)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collectionMode) =>
        this.collectionMode.setValue(collectionMode, { emitEvent: false })
      );
    this.collectionMode.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collectionMode) =>
        this.store.dispatch(changeCollectionMode({ collectionMode }))
      );
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  getCount(cardId: string): number {
    if (this.collection === null) {
      return 0;
    }
    return this.collection.find((value) => value.id === cardId)?.count ?? 0;
  }

  addToDeck(card: ICard) {
    if (this.collectionMode.value) {
      return;
    }

    this.onCardClick.emit(card.id);
  }

  onPageChange(event: any, slice?: number) {
    this.first = event.first;
    this.page = event.page;
    this.cardsToShow = this.cards.slice(
      event.first,
      (slice ?? this.cardsPerPage) * (event.page + 1)
    );
  }

  getCardsInARow() {
    return 'cards-in-a-row-' + this.cardsPerRow;
  }

  changeSlice(event: any) {
    this.onPageChange({ first: this.first, page: this.page }, event.value);
  }
}
