import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { SidebarModule } from 'primeng/sidebar';
import { Subject, takeUntil } from 'rxjs';
import { WebsiteActions } from 'src/app/store/digimon.actions';
import { DigimonCard, ICountCard, IDraggedCard } from '../../../../models';
import { DRAG } from '../../../../models/enums/drag.enum';
import { withoutJ } from '../../../functions/digimon-card.functions';
import {
  selectCollection,
  selectCollectionMode,
  selectDraggedCard,
} from '../../../store/digimon.selectors';
import { ViewCardDialogComponent } from '../../shared/dialogs/view-card-dialog.component';
import { FilterSideBoxComponent } from '../../shared/filter/filter-side-box.component';
import { FullCardComponent } from '../../shared/full-card.component';
import { dummyCard } from './../../../store/reducers/digimon.reducers';
import { PaginationCardListHeaderComponent } from './pagination-card-list-header.component';
import { SearchComponent } from './search.component';

@Component({
  selector: 'digimon-pagination-card-list',
  template: `
    <div>
      <digimon-pagination-card-list-header
        (filterBox)="filterBox = $event"
        (cardsToShow)="cards = $event"></digimon-pagination-card-list-header>

      <digimon-search></digimon-search>
    </div>

    <div class="max-h-[calc(100vh-90px)] flex flex-wrap overflow-y-scroll">
      <digimon-full-card
        class="w-24 m-1 flex items-center justify-center"
        *ngFor="let card of cards"
        [collectionMode]="(collectionMode$ | async) ?? false"
        [card]="card"
        [count]="getCount(card.id)"
        [deckBuilder]="true"
        [collectionOnly]="collectionOnly"
        (viewCard)="viewCard($event)"></digimon-full-card>
    </div>

    <!--div
      class="mx-1 w-full grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 overflow-hidden"
      *ngIf="draggedCard$ | async as draggedCard"
      [pDroppable]="['fromDeck', 'fromSide']"
      (onDrop)="drop(draggedCard, draggedCard)">
      <h1
        *ngIf="cards.length === 0"
        class="primary-color text-bold my-10 text-center text-5xl">
        No cards found!
      </h1>

      <digimon-full-card
        *ngFor="let card of cards"
        [collectionMode]="(collectionMode$ | async) ?? false"
        [card]="card"
        [count]="getCount(card.id)"
        [deckBuilder]="true"
        [collectionOnly]="collectionOnly"
        (viewCard)="viewCard($event)"></digimon-full-card>
    </div-->

    <p-sidebar
      [(visible)]="filterBox"
      position="right"
      styleClass="w-[24rem] overflow-x-hidden overflow-y-scroll p-0">
      <digimon-filter-side-box></digimon-filter-side-box>
    </p-sidebar>

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
    SidebarModule,
    DataViewModule,
  ],
})
export class PaginationCardListComponent implements OnInit, OnDestroy {
  @Input() collectionOnly: boolean = false;

  filterBox = false;

  draggedCard$ = this.store.select(selectDraggedCard);

  collectionMode$ = this.store.select(selectCollectionMode);

  viewCardDialog = false;
  card = JSON.parse(JSON.stringify(dummyCard));

  cards: DigimonCard[] = [];

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
    return (
      this.collection.find((value) => value.id === withoutJ(cardId))?.count ?? 0
    );
  }

  viewCard(card: DigimonCard) {
    this.viewCardDialog = true;
    this.card = card;
  }

  drop(card: IDraggedCard, dragCard: IDraggedCard) {
    if (dragCard.drag === DRAG.Side) {
      this.store.dispatch(
        WebsiteActions.removeCardFromSideDeck({ cardId: card.card.id }),
      );
      return;
    }
    this.store.dispatch(
      WebsiteActions.removeCardFromDeck({ cardId: card.card.id }),
    );
  }
}
