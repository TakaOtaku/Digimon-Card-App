import { AsyncPipe, NgClass, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { DigimonCard, DRAG, dummyCard, ICountCard, IDraggedCard } from '../../../../models';
import { ImgFallbackDirective } from '../../../directives/ImgFallback.directive';
import { IntersectionListenerDirective } from '../../../directives/intersection-listener.directive';
import { withoutJ } from '../../../functions';
import { DialogStore } from '../../../store/dialog.store';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { SaveStore } from '../../../store/save.store';
import { WebsiteStore } from '../../../store/website.store';
import { ViewCardDialogComponent } from '../../shared/dialogs/view-card-dialog.component';
import { FilterSideBoxComponent } from '../../shared/filter/filter-side-box.component';
import { FullCardComponent } from '../../shared/full-card.component';
import { PaginationCardListHeaderComponent } from './pagination-card-list-header.component';
import { SearchComponent } from './search.component';

@Component({
  selector: 'digimon-pagination-card-list',
  template: `
    <div class="flex flex-col w-full">
      <digimon-pagination-card-list-header
        [filterButton]="!filterBoxEnabled"
        (filterBox)="filterBox = $event"
        [widthForm]="widthForm"
        [viewOnly]="
          inputCollection.length > 0
        "></digimon-pagination-card-list-header>

      <digimon-search></digimon-search>

      <div
        [pDroppable]="['fromDeck', 'fromSide']"
        (onDrop)="drop(draggedCard(), draggedCard())"
        class="h-[calc(100vh-8.5rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-5rem)] flex flex-wrap w-full content-start justify-start overflow-y-scroll">
        @for (card of showCards; track $index) {
          @defer (on viewport) {
            <digimon-full-card
              [style]="{ width: widthForm.value + 'rem' }"
              class="m-0.5 md:m-1 flex items-center justify-center self-start"
              [card]="card"
              [count]="getCount(card.id)"
              [deckBuilder]="true"
              [collectionOnly]="collectionOnly"
              [onlyView]="inputCollection.length > 0"
              (viewCard)="viewCard($event)"></digimon-full-card>
            <div
              *ngIf="$index + 1 === showCards.length"
              (digimonIntersectionListener)="loadItems()"
              class="sm:m-0.5 md:m-1"></div>
          } @placeholder {
            <p-skeleton
              class="sm:m-0.5 md:m-1"
              width="5.6rem"
              height="10rem"></p-skeleton>
          }
        } @empty {
          <h1
            *ngIf="filteredCards().length === 0"
            class="primary-color text-bold my-10 text-center text-5xl">
            No cards found!
          </h1>
        }
      </div>
    </div>

    <digimon-filter-side-box
      *ngIf="filterBoxEnabled"
      class="hidden xl:flex"></digimon-filter-side-box>

    <p-sidebar
      [(visible)]="filterBox"
      position="right"
      styleClass="w-[20rem] md:w-[24rem] overflow-x-hidden overflow-y-auto p-0">
      <digimon-filter-side-box></digimon-filter-side-box>
    </p-sidebar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PaginationCardListHeaderComponent,
    SearchComponent,
    NgIf,
    DragDropModule,
    NgFor,
    NgClass,
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
export class PaginationCardListComponent {
  @Input() collectionOnly: boolean = false;
  @Input() initialWidth = 5.6;
  @Input() inputCollection: ICountCard[] = [];

  digimonCardStore = inject(DigimonCardStore);
  websiteStore = inject(WebsiteStore);
  saveStore = inject(SaveStore);
  dialogStore = inject(DialogStore);

  draggedCard = this.websiteStore.draggedCard;
  collection = this.saveStore.collection;

  widthForm = new FormControl(this.initialWidth);

  filterBox = false;
  filterBoxEnabled = true;
  card = JSON.parse(JSON.stringify(dummyCard));

  perPage = 100;
  page = 1;
  filteredCards = this.digimonCardStore.filteredCards;
  showCards: DigimonCard[] = [];

  constructor() {
    effect(() => {
      const settings = this.saveStore.settings();
      if (
        settings.fullscreenFilter === null ||
        settings.fullscreenFilter === undefined
      ) {
        return true;
      }
      return settings.fullscreenFilter;
    });

    effect(() => {
      console.log('Filtered Cards changed');
      const filteredCards = this.digimonCardStore.filteredCards();
      this.showCards = filteredCards.slice(0, this.perPage);
      this.page = 1;
    });
  }

  getCount(cardId: string): number {
    if (this.collection() === null) {
      return 0;
    }
    return (
      this.collection().find((value) => value.id === withoutJ(cardId))?.count ?? 0
    );
  }

  viewCard(card: DigimonCard) {
    this.dialogStore.updateViewCardDialog({
      show: true,
      card,
      width: '50vw',
    });
  }

  drop(card: IDraggedCard, dragCard: IDraggedCard) {
    if (dragCard.drag === DRAG.Side) {
      this.websiteStore.removeCardFromSideDeck(card.card.id);
      return;
    }
    this.websiteStore.removeCardFromDeck(card.card.id);
  }

  loadItems() {
    const from = this.page * this.perPage;
    const to = (this.page + 1) * this.perPage;
    const newCards = this.filteredCards().slice(from, to);
    this.showCards.push(...newCards);
    this.page = this.page + 1;
  }
}
