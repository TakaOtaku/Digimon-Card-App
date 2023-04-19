import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { englishCards } from '../../../../assets/cardlists/eng/english';
import { ICard, ICountCard, IDraggedCard } from '../../../../models';
import { DRAG } from '../../../../models/enums/drag.enum';
import { removeCardFromDeck, removeCardFromSideDeck } from '../../../store/digimon.actions';
import { selectCollection, selectCollectionMode, selectDraggedCard } from '../../../store/digimon.selectors';
import { ViewCardDialogComponent } from '../../shared/dialogs/view-card-dialog.component';
import { FilterSideBoxComponent } from '../../shared/filter/filter-side-box.component';
import { DialogModule } from 'primeng/dialog';
import { FullCardComponent } from '../../shared/full-card.component';
import { DragDropModule } from 'primeng/dragdrop';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { SearchComponent } from './search.component';
import { PaginationCardListHeaderComponent } from './pagination-card-list-header.component';

@Component({
  selector: 'digimon-pagination-card-list',
  template: `
    <digimon-pagination-card-list-header
      (filterBox)="filterBox = $event"
      (cardsToShow)="cards = $event"></digimon-pagination-card-list-header>

    <digimon-search></digimon-search>

    <div
      class="mx-1 flex w-full flex-row flex-wrap overflow-hidden"
      *ngIf="draggedCard$ | async as draggedCard"
      [pDroppable]="['fromDeck', 'fromSide']"
      (onDrop)="drop(draggedCard, draggedCard)">
      <h1 *ngIf="cards.length === 0" class="primary-color text-bold my-10 text-center text-5xl">No cards found!</h1>

      <digimon-full-card
        *ngFor="let card of cards"
        [collectionMode]="(collectionMode$ | async) ?? false"
        [deckView]="deckView"
        [card]="card"
        [count]="getCount(card.id)"
        [deckBuilder]="true"
        [collectionOnly]="collectionOnly"
        (viewCard)="viewCard($event)"
        class="max-w-[12.5%] flex-[1_1_12.5%]"></digimon-full-card>
    </div>

    <p-dialog
      header="Filter and Sort"
      (close)="filterBox = false"
      [(visible)]="filterBox"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000">
      <digimon-filter-side-box></digimon-filter-side-box>
    </p-dialog>

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PaginationCardListHeaderComponent,
    SearchComponent,
    NgIf,
    DragDropModule,
    NgFor,
    FullCardComponent,
    DialogModule,
    FilterSideBoxComponent,
    ViewCardDialogComponent,
    AsyncPipe,
  ],
})
export class PaginationCardListComponent implements OnInit, OnDestroy {
  @Input() deckView: boolean;
  @Input() collectionOnly: boolean = false;

  filterBox = false;

  draggedCard$ = this.store.select(selectDraggedCard);

  collectionMode$ = this.store.select(selectCollectionMode);

  viewCardDialog = false;
  card = englishCards[0];

  cards: ICard[] = [];

  private collection: ICountCard[] = [];
  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select(selectCollection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collection) => (this.collection = collection));
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  getCount(cardId: string): number {
    if (this.collection === null) {
      return 0;
    }
    return this.collection.find((value) => value.id === cardId)?.count ?? 0;
  }

  viewCard(card: ICard) {
    this.viewCardDialog = true;
    this.card = card;
  }

  drop(card: IDraggedCard, dragCard: IDraggedCard) {
    if (dragCard.drag === DRAG.Side) {
      this.store.dispatch(removeCardFromSideDeck({ cardId: card.card.id }));
      return;
    }
    this.store.dispatch(removeCardFromDeck({ cardId: card.card.id }));
  }
}
