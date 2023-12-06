import { AsyncPipe, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { map, Subject, takeUntil, tap } from 'rxjs';
import { WebsiteActions } from 'src/app/store/digimon.actions';
import { DigimonCard, ICountCard, IDraggedCard } from '../../../../models';
import { DRAG } from '../../../../models/enums/drag.enum';
import { ImgFallbackDirective } from '../../../directives/ImgFallback.directive';
import { IntersectionListenerDirective } from '../../../directives/intersection-listener.directive';
import { withoutJ } from '../../../functions/digimon-card.functions';
import {
  selectCollection,
  selectCollectionMode,
  selectDraggedCard,
  selectFilteredCards,
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
    <div *ngIf="cards$ | async">
      <digimon-pagination-card-list-header
        (filterBox)="filterBox = $event"
        [widthForm]="widthForm"></digimon-pagination-card-list-header>

      <digimon-search></digimon-search>
    </div>

    <div
      *ngIf="draggedCard$ | async as draggedCard"
      [pDroppable]="['fromDeck', 'fromSide']"
      (onDrop)="drop(draggedCard, draggedCard)"
      class="flex flex-wrap h-[calc(100vh-8.5rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-5rem)] justify-between overflow-y-scroll">
      @for (card of showCards; track $index) {
        @defer (on viewport) {
          <digimon-full-card
            [style]="{ width: widthForm.value + 'rem' }"
            class="m-0.5 md:m-1 flex items-center justify-center"
            [collectionMode]="(collectionMode$ | async) ?? false"
            [card]="card"
            [count]="getCount(card.id)"
            [deckBuilder]="true"
            [collectionOnly]="collectionOnly"
            (viewCard)="viewCard($event)"></digimon-full-card>
          <p-skeleton
            *ngIf="$index + 1 === showCards.length"
            (digimonIntersectionListener)="loadItems()"
            class="sm:m-0.5 md:m-1"
            width="8rem"
            height="13rem"></p-skeleton>
        } @placeholder {
          <p-skeleton
            class="sm:m-0.5 md:m-1"
            width="8rem"
            height="13rem"></p-skeleton>
        }
      } @empty {
        <h1
          *ngIf="cards.length === 0"
          class="primary-color text-bold my-10 text-center text-5xl">
          No cards found!
        </h1>
      }
    </div>

    <p-sidebar
      [(visible)]="filterBox"
      position="right"
      styleClass="w-[20rem] md:w-[24rem] overflow-x-hidden overflow-y-auto p-0">
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
    ImgFallbackDirective,
    NgOptimizedImage,
    SkeletonModule,
    IntersectionListenerDirective,
  ],
})
export class PaginationCardListComponent implements OnInit, OnDestroy {
  @Input() collectionOnly: boolean = false;
  @Input() initialWidth = 8;

  private store = inject(Store);
  private element = inject(ElementRef);

  widthForm = new FormControl(this.initialWidth);

  filterBox = false;

  draggedCard$ = this.store.select(selectDraggedCard);
  collectionMode$ = this.store.select(selectCollectionMode);

  viewCardDialog = false;
  card = JSON.parse(JSON.stringify(dummyCard));

  perPage = 100;
  page = 1;
  cards: DigimonCard[] = [];
  showCards: DigimonCard[] = [];
  cards$ = this.store.select(selectFilteredCards).pipe(
    tap((cards) => (this.cards = cards)),
    tap((cards) => (this.showCards = cards.slice(0, this.perPage))),
  );

  private collection: ICountCard[] = [];
  private onDestroy$ = new Subject();
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

  loadItems() {
    this.showCards.push(
      ...this.cards.slice(
        this.page * this.perPage,
        (this.page + 1) * this.perPage,
      ),
    );
    this.page = this.page + 1;
  }
}
