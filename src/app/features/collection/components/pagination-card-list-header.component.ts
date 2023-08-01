import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PaginatorModule } from 'primeng/paginator';
import { Subject, takeUntil } from 'rxjs';
import { SaveActions } from 'src/app/store/digimon.actions';
import { DigimonCard } from '../../../../models';
import { selectCollectionMode, selectFilteredCards } from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-pagination-card-list-header',
  template: `
    <div class="flex h-10 w-full flex-row">
      <p-paginator
        (onPageChange)="onPageChange($event)"
        [first]="first"
        [rows]="48"
        [showJumpToPageDropdown]="true"
        [showPageLinks]="false"
        [totalRecords]="cards.length"
        class="ml-auto"
        styleClass="border-0 h-10 bg-transparent ml-auto"></p-paginator>

      <div class="mx-2 mt-2 flex flex-row justify-center">
        <span class="text-xs font-bold leading-9 text-[#e2e4e6]">Collection Mode:</span>
        <input type="checkbox" class="my-auto ml-1 h-5 w-5" [ngModel]="collectionMode$ | async" (ngModelChange)="changeCollectionMode($event)" />
      </div>

      <button (click)="filterBox.emit(true)" class="min-w-auto primary-background m-auto h-8 w-32 rounded p-2 text-xs font-semibold text-[#e2e4e6] 2xl:hidden">
        <i class="pi pi-filter-fill mr-3"></i>Filter
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PaginatorModule, FormsModule, AsyncPipe],
})
export class PaginationCardListHeaderComponent implements OnInit, OnDestroy {
  @Output() filterBox = new EventEmitter<boolean>();
  @Output() cardsToShow = new EventEmitter<DigimonCard[]>();

  cards: DigimonCard[] = [];

  first = 0;
  page = 0;

  collectionMode$ = this.store.select(selectCollectionMode);

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select(selectFilteredCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cards) => {
        this.cards = cards;
        this.cardsToShow.next(cards.slice(0, 48));
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  onPageChange(event: any, slice?: number) {
    this.first = event.first;
    this.page = event.page;
    this.cardsToShow.next(this.cards.slice(event.first, (slice ?? 48) * (event.page + 1)));
  }

  changeCollectionMode(collectionMode: boolean) {
    this.store.dispatch(SaveActions.setcollectionmode({ collectionMode }));
  }
}
