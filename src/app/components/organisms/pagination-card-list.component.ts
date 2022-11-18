import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { englishCards } from '../../../assets/cardlists/eng/english';
import { ICard, ICountCard } from '../../../models';
import { changeCollectionMode } from '../../store/digimon.actions';
import {
  selectCollection,
  selectCollectionMode,
  selectFilteredCards,
} from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-pagination-card-list',
  template: `<div
      class="align-items-center surface-card flex h-10 flex-row justify-evenly"
    >
      <div class="col-span-2 my-auto">
        <p-paginator
          (onPageChange)="onPageChange($event)"
          [first]="first"
          [rows]="cardsPerPage"
          [showJumpToPageDropdown]="true"
          [showPageLinks]="false"
          [totalRecords]="cards.length"
          styleClass="border-0 h-10"
        ></p-paginator>
      </div>

      <div class="m-auto mt-2 flex flex-row justify-center">
        <span class="text-xs font-bold leading-9 text-white"
          >Collection Mode:</span
        >
        <input
          type="checkbox"
          class="my-auto ml-1 h-5 w-5"
          [formControl]="collectionMode"
        />
      </div>

      <button
        (click)="filterBox = true"
        class="min-w-auto primary-background m-auto h-8 w-32 rounded p-2 text-xs font-semibold text-white 2xl:hidden"
      >
        <i class="pi pi-filter-fill mr-3"></i>Filter
      </button>
    </div>

    <digimon-search></digimon-search>

    <div class="card-box flex w-full flex-row flex-wrap overflow-hidden">
      <h1
        *ngIf="cards.length === 0"
        class="primary-color text-bold my-10 text-center text-5xl"
      >
        No cards found!
      </h1>

      <digimon-full-card
        *ngFor="let card of cardsToShow"
        [collectionMode]="collectionMode.value"
        [deckView]="deckView"
        [card]="card"
        [count]="getCount(card.id)"
        [deckBuilder]="true"
        [ngClass]="getCardsInARow()"
        [collectionOnly]="collectionOnly"
        (viewCard)="viewCard($event)"
      ></digimon-full-card>
    </div>

    <p-dialog
      header="Filter and Sort"
      [(visible)]="filterBox"
      styleClass="w-[95vw] max-w-[500px] h-[95vh] surface-ground"
      [baseZIndex]="10000"
    >
      <digimon-filter-side-box></digimon-filter-side-box>
    </p-dialog>

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
    </p-dialog> `,
  styleUrls: ['pagination-card-list.component.scss'],
})
export class PaginationCardListComponent implements OnInit, OnDestroy {
  @Input() deckView: boolean;
  @Input() collectionOnly: boolean = false;

  viewCardDialog = false;
  card = englishCards[0];

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

  viewCard(card: ICard) {
    this.viewCardDialog = true;
    this.card = card;
  }
}
