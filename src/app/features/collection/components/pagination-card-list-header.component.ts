import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PaginatorModule } from 'primeng/paginator';
import { Subject, takeUntil } from 'rxjs';
import { SaveActions } from 'src/app/store/digimon.actions';
import { DigimonCard } from '../../../../models';
import {
  selectCollectionMode,
  selectFilteredCards,
} from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-pagination-card-list-header',
  template: `
    <div class="relative flex justify-center h-10 w-full flex-row">
      <div
        class="absolute left-2 top-4 flex flex-row justify-center items-center">
        <span class="text-xs font-bold text-[#e2e4e6]">Collection Mode:</span>
        <input
          type="checkbox"
          class="my-auto ml-1 h-5 w-5"
          [ngModel]="collectionMode$ | async"
          (ngModelChange)="changeCollectionMode($event)" />
      </div>

      <!--p-paginator
        (onPageChange)="onPageChange($event)"
        [first]="first"
        [rows]="rows"
        [showJumpToPageDropdown]="true"
        [showPageLinks]="false"
        [totalRecords]="cards.length"
        styleClass="border-0 h-10 bg-transparent"></p-paginator-->

      <div class="mx-2 mt-2 flex flex-row justify-center absolute right-2">
        <button
          (click)="filterBox.emit(true)"
          class="min-w-auto primary-background h-8 w-32 rounded p-2 text-xs font-semibold text-[#e2e4e6] 2xl:hidden">
          <i class="pi pi-filter-fill mr-3"></i>Filter
        </button>
      </div>
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
  rows = 48;

  collectionMode$ = this.store.select(selectCollectionMode);

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select(selectFilteredCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cards) => {
        this.cards = cards;
        this.cardsToShow.next(cards.slice(0, 300));
      });

    //this.checkScreenWidth(window.innerWidth);
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenWidth((event.target as Window).innerWidth);
  }

  private checkScreenWidth(innerWidth: number) {
    const xl = innerWidth >= 1280;
    const lg = innerWidth >= 1024;
    const md = innerWidth >= 768;
    if (xl) {
      this.rows = 40;
    } else if (lg) {
      this.rows = 32;
    } else if (md) {
      this.rows = 24;
    } else {
      this.rows = 12;
    }
    this.cardsToShow.next(this.cards.slice(0, this.rows));
  }

  onPageChange(event: any, slice?: number) {
    this.first = event.first;
    this.page = event.page;
    this.cardsToShow.next(
      this.cards.slice(event.first, (slice ?? this.rows) * (event.page + 1)),
    );
  }

  changeCollectionMode(collectionMode: boolean) {
    this.store.dispatch(SaveActions.setCollectionMode({ collectionMode }));
  }
}
