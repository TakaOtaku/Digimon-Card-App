import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {ICard, ICountCard} from "../../../models";
import {selectCollection, selectCollectionMode, selectFilteredCards} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-pagination-card-list',
  templateUrl: './pagination-card-list.component.html',
  styleUrls: ['./pagination-card-list.component.css']
})
export class PaginationCardListComponent implements OnInit {
  @Output() onCardClick = new EventEmitter<string>();

  public pagination = 8;

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
      .subscribe((collection) => {
        this.collection = collection;
      });
    this.store.select(selectCollectionMode).pipe(takeUntil(this.onDestroy$))
      .subscribe((collectionMode) => {
        this.collectionMode = collectionMode;
      });
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
    this.pagination += 8;
    this.cardsToShow = this.cards.slice(this.pagination - 8, this.pagination);
  }

  previous() {
    this.pagination -= 8;
    this.cardsToShow = this.cards.slice(this.pagination - 8, this.pagination);
  }

  get previousCards(): boolean {
    return this.pagination === 8;
  }

  get nextCards(): boolean {
    return this.pagination >= this.cards.length;
  }
}
