import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {ICard, ICountCard} from "../../../../models";
import {setViewCardDialog} from "../../../store/digimon.actions";
import {selectCollection, selectCollectionMode, selectFilteredCards} from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-pagination-card-list',
  templateUrl: './pagination-card-list.component.html'
})
export class PaginationCardListComponent implements OnInit {
  @Output() onCardClick = new EventEmitter<string>();

  first = 0;
  page = 0;

  cards: ICard[] = [];
  cardsToShow: ICard[] = [];

  cardsPerRow = 8;
  cardsPerRowOptions = [2, 4, 6, 8, 10];

  cardsPerPage = 50;
  cardsPerPageOptions = [25, 50, 100];

  private collection: ICountCard[] = [];
  collectionMode = true;

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(selectFilteredCards).pipe(takeUntil(this.onDestroy$))
      .subscribe((cards) => {
        this.cards = cards;
        this.cardsToShow = cards.slice(0, this.cardsPerPage);
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
    if(this.collection === null) {return 0}
    return this.collection.find(value => value.id === cardId)?.count ?? 0;
  }

  addToDeck(card: ICard) {
    this.onCardClick.emit(card.id)
  }

  showDetails(card: ICard) {
    this.store.dispatch(setViewCardDialog({show: true, card}));
  }

  onPageChange(event: any, slice?: number) {
    this.first = event.first;
    this.page = event.page;
    this.cardsToShow = this.cards.slice(event.first, (slice ?? this.cardsPerPage) * (event.page+1));
  }

  getGridCols() {
    return 'grid-cols-'+this.cardsPerRow;
  }

  changeSlice(event: any) {
    this.onPageChange({first: this.first, page: this.page}, event.value);
  }
}
