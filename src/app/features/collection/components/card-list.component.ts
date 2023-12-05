import { DeferModule } from 'primeng/defer';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { withoutJ } from '../../../functions/digimon-card.functions';
import { dummyCard } from './../../../store/reducers/digimon.reducers';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
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
    <div class="flex flex-wrap justify-center" *ngIf="cards$ | async as cards">
      <h1
        *ngIf="cards.length === 0"
        class="primary-color text-bold my-10 text-5xl">
        No cards found!
      </h1>

      <div
        *ngIf="collection$ | async as collection"
        class="flex w-full flex-row flex-wrap">
        <p-scrollPanel
          class="flex w-full flex-row flex-wrap"
          [style]="{ width: '100%', height: '100vh' }">
          <div pDefer>
            <ng-template>
              <digimon-full-card
                *ngFor="let card of cards"
                (viewCard)="viewCard($event)"
                [card]="card"
                [collectionMode]="(collectionMode$ | async) ?? false"
                [count]="getCount(card.id, collection)"
                [deckBuilder]="true"
                [collectionOnly]="collectionOnly"
                class="flex-[1 1 12.5%] max-w-[12.5%] scale-95 transition">
              </digimon-full-card>
            </ng-template>
          </div>
        </p-scrollPanel>
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
    DeferModule,
    ScrollPanelModule,
  ],
})
export class CardListComponent {
  @Input() public showCount: number = 32;
  @Input() public collectionOnly: boolean = false;
  @Input() public deckView: boolean = false;

  private store = inject(Store);

  collectionMode$ = this.store.select(selectCollectionMode);
  collection$ = this.store.select(selectCollection);
  cards$ = this.store.select(selectFilteredCards);

  viewCardDialog = false;
  card = JSON.parse(JSON.stringify(dummyCard));

  /**
   * Search the user collection for the number and return the count
   */
  getCount(cardId: string, collection: ICountCard[]): number {
    if (collection === null) {
      return 0;
    }
    return (
      collection.find((value) => value.id === withoutJ(cardId))?.count ?? 0
    );
  }

  viewCard(card: DigimonCard) {
    this.viewCardDialog = true;
    this.card = card;
  }
}
