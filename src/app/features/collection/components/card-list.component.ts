import { withoutJ } from '../../../functions/digimon-card.functions';
import { dummyCard } from './../../../store/reducers/digimon.reducers';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';
import { DigimonCard, ICountCard } from '../../../../models';
import {
  selectCollection,
  selectCollectionMode,
  selectFilteredCards,
} from '../../../store/digimon.selectors';
import { ViewCardDialogComponent } from '../../shared/dialogs/view-card-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FullCardComponent } from '../../shared/full-card.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'digimon-card-list',
  template: `
    <div
      class="flex flex-wrap justify-center overflow-hidden"
      *ngIf="cards$ | async">
      <h1
        *ngIf="cardsToShow.length === 0"
        class="primary-color text-bold my-10 text-5xl">
        No cards found!
      </h1>

      <div class="flex w-full flex-row flex-wrap">
        <digimon-full-card
          *ngFor="let card of cardsToShow"
          (viewCard)="viewCard($event)"
          [card]="card"
          [collectionMode]="(collectionMode$ | async) ?? false"
          [count]="getCount(card.id)"
          [deckView]="true"
          [deckBuilder]="true"
          [collectionOnly]="collectionOnly"
          class="flex-[1 1 25%] max-w-[25%] scale-95 transition">
        </digimon-full-card>
      </div>

      <button
        *ngIf="moreCardsThere()"
        pButton
        label="Show more..."
        (click)="showMore()"
        class="p-button-outlined surface-ground min-w-auto mb-6 mt-2 h-8 w-full p-2 text-xs font-semibold text-[#e2e4e6]"></button>
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
      <digimon-view-card-dialog
        (onClose)="viewCardDialog = false"
        [card]="card"></digimon-view-card-dialog>
    </p-dialog>
  `,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FullCardComponent,
    ButtonModule,
    DialogModule,
    ViewCardDialogComponent,
    AsyncPipe,
  ],
})
export class CardListComponent implements OnInit, OnDestroy {
  @Input() public showCount: number;
  @Input() public collectionOnly: boolean = false;

  cards$ = this.store.select(selectFilteredCards).pipe(
    tap((cards) => (this.cards = cards)),
    tap((cards) => (this.cardsToShow = this.cards.slice(0, this.showCount)))
  );

  viewCardDialog = false;
  card = JSON.parse(JSON.stringify(dummyCard));

  cards: DigimonCard[];
  cardsToShow: DigimonCard[];

  collectionMode$ = this.store.select(selectCollectionMode);

  private collection: ICountCard[] = [];

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select(selectCollection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collection) => {
        this.collection = collection;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  /**
   * Search the user collection for the number and return the count
   */
  getCount(cardId: string): number {
    if (this.collection === null) {
      return 0;
    }
    return (
      this.collection.find((value) => value.id === withoutJ(cardId))?.count ?? 0
    );
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

  viewCard(card: DigimonCard) {
    this.viewCardDialog = true;
    this.card = card;
  }
}
