import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subject, takeUntil } from 'rxjs';
import { englishCards } from '../../../assets/cardlists/eng/english';
import { ICard } from '../../../models';
import { DRAG } from '../../../models/enums/drag.enum';
import { addCardToDeck, changeCardCount, setDraggedCard } from '../../store/digimon.actions';
import { selectDeck, selectSettings } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-full-card',
  template: `
    <div
      [pDraggable]="'toDeck'"
      (onDragStart)="setDraggedCard(card)"
      class="relative inline-flex w-full transition-transform hover:scale-105">
      <div (click)="click()" (contextmenu)="rightclick()">
        <digimon-card-image
          [card]="card"
          [count]="count"
          [collectionMode]="collectionMode"
          [collectionMinimum]="collectionMinimum"
          [aaCollectionMinimum]="aaCollectionMinimum"></digimon-card-image>
      </div>

      <ng-container *ngIf="{ count: countInDeck$ | async } as deckCard">
        <span
          *ngIf="!collectionOnly && deckBuilder && deckCard.count"
          class="text-shadow-white absolute right-1 z-[100] px-1 text-3xl font-black text-orange-500"
          [ngClass]="{
            'bottom-1': !collectionMode,
            ' bottom-10': collectionMode
          }">
          {{ deckCard.count }}<span class="pr-1 text-sky-700">/</span
          >{{
            card.cardNumber === 'BT6-085' || card.cardNumber === 'EX2-046' || card.cardNumber === 'BT11-061' ? 50 : 4
          }}
        </span>
      </ng-container>

      <div *ngIf="collectionMode" class="counter mx-5 flex h-8 w-full flex-row rounded-lg bg-transparent">
        <button
          (click)="decreaseCardCount(card.id)"
          class="primary-background h-full w-1/3 cursor-pointer rounded-l text-[#e2e4e6] outline-none">
          <span class="m-auto text-2xl font-thin">−</span>
        </button>
        <input
          type="number"
          min="0"
          class="primary-background text-md flex w-1/3 cursor-default appearance-none items-center text-center font-semibold text-[#e2e4e6] outline-none focus:outline-none md:text-base"
          [(ngModel)]="count"
          (change)="changeCardCount($event, card.id)" />
        <button
          (click)="increaseCardCount(card.id)"
          class="primary-background h-full w-1/3 cursor-pointer rounded-r text-[#e2e4e6] outline-none">
          <span class="m-auto text-2xl font-thin">+</span>
        </button>
      </div>
    </div>

    <p-dialog
      (close)="viewCardDialog = false"
      [(visible)]="viewCardDialog"
      [baseZIndex]="100000"
      [showHeader]="false"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="overflow-x-hidden">
      <digimon-view-card-dialog (onClose)="viewCardDialog = false" [card]="card"></digimon-view-card-dialog>
    </p-dialog>
  `,
  styleUrls: ['./full-card.component.scss'],
})
export class FullCardComponent implements OnInit, OnDestroy {
  @Input() card: ICard = englishCards[0];
  @Input() count: number;

  @Input() width?: string;
  @Input() compact?: boolean = false;
  @Input() collectionMode: boolean = false;
  @Input() deckBuilder?: boolean = false;
  @Input() biggerCards?: boolean = false;

  @Input() deckView: boolean;
  @Input() collectionOnly: boolean = false;

  @Output() viewCard = new EventEmitter<ICard>();

  cardWidth = 7 + 'vmin';

  viewCardDialog = false;

  collectionMinimum = 0;
  aaCollectionMinimum = 0;

  countInDeck$ = this.store
    .select(selectDeck)
    .pipe(map((deck) => deck.cards.find((value) => value.id === this.card.id)?.count ?? 0));

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select(selectSettings)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((settings) => {
        this.collectionMinimum = settings.collectionMinimum;
        this.aaCollectionMinimum = settings.aaCollectionMinimum;
      });
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

  setDraggedCard(card: ICard) {
    this.store.dispatch(setDraggedCard({ dragCard: { card: card, drag: DRAG.Collection } }));
  }

  click() {
    if (this.collectionOnly) {
      this.showCardDetails();
      return;
    }
    this.addCardToDeck();
  }

  rightclick() {
    this.showCardDetails();
  }
}
