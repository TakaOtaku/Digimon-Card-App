import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {ICard, ICountCard} from "../../../../models";
import {selectCollection, selectCollectionMode, selectFilteredCards} from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-pagination-card-list',
  templateUrl: './pagination-card-list.component.html'
})
export class PaginationCardListComponent implements OnInit {
  @Output() onCardClick = new EventEmitter<string>();

  private pagRate = 10;
  public pagination = 10;

  private cards: ICard[] = [];
  public cardsToShow: ICard[] = [];

  private collection: ICountCard[] = [];
  collectionMode = true;

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(selectFilteredCards).pipe(takeUntil(this.onDestroy$))
      .subscribe((cards) => {
        this.cards = cards.filter(card => card.version === 'Normal');
        this.cardsToShow = this.cards.slice(0, this.pagination);
      });

    this.store.select(selectCollection).pipe(takeUntil(this.onDestroy$))
      .subscribe((collection) => this.collection = collection);

    this.store.select(selectCollectionMode).pipe(takeUntil(this.onDestroy$))
      .subscribe((collectionMode) => this.collectionMode = collectionMode);
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  getCount(cardId: string): number {
    return this.collection.find(value => value.id === cardId)?.count ?? 0;
  }

  addToDeck(card: ICard) {
    this.onCardClick.emit(card.cardNumber)
  }

  next() {
    this.pagination += this.pagRate;
    this.cardsToShow = this.cards.slice(this.pagination - this.pagRate, this.pagination);
  }

  previous() {
    this.pagination -= this.pagRate;
    this.cardsToShow = this.cards.slice(this.pagination - this.pagRate, this.pagination);
  }

  get previousCards(): boolean {
    return this.pagination === this.pagRate;
  }

  get nextCards(): boolean {
    return this.pagination >= this.cards.length;
  }
}
