import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { map, Subject, takeUntil } from 'rxjs';
import { DigimonCard } from '../../../models';
import { DRAG } from '../../../models/enums/drag.enum';
import { withoutJ } from '../../functions/digimon-card.functions';
import { selectDeck, selectSettings } from '../../store/digimon.selectors';
import {
  CollectionActions,
  WebsiteActions,
} from './../../store/digimon.actions';
import { dummyCard } from './../../store/reducers/digimon.reducers';
import { CardImageComponent } from './card-image.component';
import { ViewCardDialogComponent } from './dialogs/view-card-dialog.component';

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
            card.cardNumber === 'BT6-085' ||
            card.cardNumber === 'EX2-046' ||
            card.cardNumber === 'BT11-061'
              ? 50
              : 4
          }}
        </span>
      </ng-container>

      <div
        *ngIf="collectionMode || onlyView"
        class="flex absolute bottom-2 left-1/2 transform -translate-x-1/2 h-8 w-[calc(100%-1rem)] flex-row rounded-lg bg-transparent">
        <button
          *ngIf="!onlyView"
          (click)="decreaseCardCount(card.id)"
          class="primary-background h-full w-1/3 cursor-pointer rounded-l text-[#e2e4e6] outline-none">
          <span class="m-auto text-2xl font-thin">−</span>
        </button>
        <input
          type="number"
          min="0"
          [ngClass]="{ 'mx-auto': onlyView }"
          class="primary-background text-md flex w-1/3 cursor-default appearance-none items-center text-center font-semibold text-[#e2e4e6] outline-none focus:outline-none md:text-base"
          [(ngModel)]="count"
          [disabled]="onlyView"
          (change)="changeCardCount($event, card.id)" />
        <button
          *ngIf="!onlyView"
          (click)="increaseCardCount(card.id)"
          class="primary-background h-full w-1/3 cursor-pointer rounded-r text-[#e2e4e6] outline-none">
          <span class="m-auto text-2xl font-thin">+</span>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./full-card.component.scss'],
  standalone: true,
  imports: [
    DragDropModule,
    CardImageComponent,
    NgIf,
    NgClass,
    FormsModule,
    DialogModule,
    AsyncPipe,
  ],
})
export class FullCardComponent implements OnInit, OnDestroy {
  @Input() card: DigimonCard = JSON.parse(JSON.stringify(dummyCard));
  @Input() count: number;

  @Input() width?: string;
  @Input() compact?: boolean = false;
  @Input() collectionMode: boolean = false;
  @Input() deckBuilder?: boolean = false;
  @Input() biggerCards?: boolean = false;

  @Input() collectionOnly: boolean = false;

  @Input() onlyView!: boolean;

  @Output() viewCard = new EventEmitter<DigimonCard>();

  collectionMinimum = 0;
  aaCollectionMinimum = 0;

  countInDeck$ = this.store
    .select(selectDeck)
    .pipe(
      map(
        (deck) =>
          deck.cards.find((value) => value.id === withoutJ(this.card.id))
            ?.count ?? 0,
      ),
    );

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
    this.store.dispatch(
      WebsiteActions.addCardToDeck({ addCardToDeck: this.card.id }),
    );
  }

  showCardDetails() {
    this.viewCard.emit(this.card);
  }

  changeCardCount(event: any, id: string) {
    if (event.target.value <= 0) {
      return;
    }
    const count = event.target.value;
    const newId = withoutJ(id);
    this.store.dispatch(CollectionActions.setCardCount({ id: newId, count }));
  }

  increaseCardCount(id: string) {
    const count = ++this.count;
    const newId = withoutJ(id);
    this.store.dispatch(CollectionActions.setCardCount({ id: newId, count }));
  }

  decreaseCardCount(id: string) {
    if (this.count <= 0) {
      return;
    }
    const count = --this.count;
    const newId = withoutJ(id);
    this.store.dispatch(CollectionActions.setCardCount({ id: newId, count }));
  }

  setDraggedCard(card: DigimonCard) {
    this.store.dispatch(
      WebsiteActions.setDraggedCard({
        dragCard: { card: card, drag: DRAG.Collection },
      }),
    );
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
