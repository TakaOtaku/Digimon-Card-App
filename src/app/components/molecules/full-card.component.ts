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
import { englishCards } from '../../../assets/cardlists/eng/english';
import { ICard } from '../../../models';
import { addCardToDeck, changeCardCount } from '../../store/digimon.actions';
import {
  selectCollectionMinimum,
  selectDeck,
} from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-full-card',
  template: `<div
      class="relative inline-flex w-full transition-transform hover:scale-105"
    >
      <div (click)="addCardToDeck()" (contextmenu)="showCardDetails()">
        <div class="absolute top-1 z-10 grid w-full grid-cols-5 gap-0">
          <div></div>
          <img
            *ngIf="card.version !== 'Normal'"
            [src]="
              aa.get(this.card.color) ??
              'assets/images/banner/ico_card_detail_multi.png'
            "
            alt="AA-Banner"
            class="col-span-3 w-full"
          />
        </div>

        <img
          [lazyLoad]="card.cardImage"
          [ngClass]="{ grayscale: count < collectionMinimum && collectionMode }"
          [ngStyle]="{ border: cardBorder, 'border-radius': cardRadius }"
          alt="{{ card.cardNumber + ' ' + card.name }}"
          class="m-auto"
          defaultImage="assets/images/digimon-card-back.webp"
        />
      </div>

      <span
        *ngIf="!collectionOnly && deckBuilder && countInDeck !== 0"
        class="text-shadow-white absolute right-1 z-[100] px-1 text-3xl font-black text-orange-500"
        [ngClass]="{
          'bottom-1': !collectionMode,
          ' bottom-10': collectionMode
        }"
      >
        {{ countInDeck }}<span class="pr-1 text-sky-700">/</span
        >{{
          card.cardNumber === 'BT6-085' ||
          card.cardNumber === 'EX2-046' ||
          card.cardNumber === 'BT11-061'
            ? 50
            : 4
        }}
      </span>

      <div
        *ngIf="collectionMode"
        class="counter mx-5 flex h-8 w-full flex-row rounded-lg bg-transparent"
      >
        <button
          (click)="decreaseCardCount(card.id)"
          class="primary-background h-full w-1/3 cursor-pointer rounded-l text-white outline-none"
        >
          <span class="m-auto text-2xl font-thin">−</span>
        </button>
        <input
          type="number"
          min="0"
          class="primary-background text-md flex w-1/3 cursor-default appearance-none items-center text-center font-semibold text-white outline-none focus:outline-none md:text-base"
          [(ngModel)]="count"
          (change)="changeCardCount($event, card.id)"
        />
        <button
          (click)="increaseCardCount(card.id)"
          class="primary-background h-full w-1/3 cursor-pointer rounded-r text-white outline-none"
        >
          <span class="m-auto text-2xl font-thin">+</span>
        </button>
      </div>
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
    </p-dialog> `,
  styleUrls: ['full-card.component.scss'],
})
export class FullCardComponent implements OnInit, OnDestroy {
  @Input() card: ICard = englishCards[0];
  @Input() count: number;

  @Input() width?: string;
  @Input() compact?: boolean = false;
  @Input() collectionMode?: boolean = false;
  @Input() deckBuilder?: boolean = false;
  @Input() biggerCards?: boolean = false;

  @Input() deckView: boolean;
  @Input() collectionOnly: boolean = false;

  @Output() viewCard = new EventEmitter<ICard>();

  cardWidth = 7 + 'vmin';
  cardBorder = '2px solid black';
  cardRadius = '5px';

  viewCardDialog = false;

  aa = new Map<string, string>([
    ['Red', 'assets/images/banner/ico_card_detail_red.png'],
    ['Blue', 'assets/images/banner/ico_card_detail_blue.png'],
    ['Yellow', 'assets/images/banner/ico_card_detail_yellow.png'],
    ['Green', 'assets/images/banner/ico_card_detail_green.png'],
    ['Black', 'assets/images/banner/ico_card_detail_black.png'],
    ['Purple', 'assets/images/banner/ico_card_detail_purple.png'],
    ['White', 'assets/images/banner/ico_card_detail_white.png'],
    ['Multi', 'assets/images/banner/ico_card_detail_multi.png'],
  ]);

  collectionMinimum = 0;

  countInDeck = 0;

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select(selectCollectionMinimum)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((minimum) => (this.collectionMinimum = minimum));
    this.store
      .select(selectDeck)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (deck) =>
          (this.countInDeck =
            deck.cards.find((value) => value.id === this.card.id)?.count ?? 0)
      );
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  addCardToDeck() {
    if (this.collectionOnly) {
      this.viewCard.emit(this.card);
      return;
    }
    this.store.dispatch(addCardToDeck({ addCardToDeck: this.card.id }));
  }

  showCardDetails() {
    this.viewCard.emit(this.card);
    //this.viewCardDialog = true;
  }

  changeCardCount(event: any, id: string) {
    if (event.target.value <= 0) {
      return;
    }
    const count = event.target.value;
    this.store.dispatch(changeCardCount({ id, count }));
  }

  increaseCardCount(id: string) {
    const count = ++this.count;
    this.store.dispatch(changeCardCount({ id, count }));
  }

  decreaseCardCount(id: string) {
    if (this.count <= 0) {
      return;
    }
    const count = --this.count;
    this.store.dispatch(changeCardCount({ id, count }));
  }

  setCardSize(size: number) {
    if (this.biggerCards) {
      this.cardWidth = '20vw';
      return;
    }
    if (this.deckBuilder) {
      this.cardWidth = '5vw';
      return;
    }
    if (this.compact) {
      this.cardWidth = this.rangeToRange(100) + 'vmin';
      return;
    }
    this.cardWidth = this.rangeToRange(size) + 'vmin';
  }

  rangeToRange = (input: number) => {
    //(((OldValue - OldMin) * NewRange) / OldRange) + NewMin
    return ((input - 5) * (30 - 20)) / (100 - 5) + 20;
  };
}
