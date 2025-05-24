import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { emptyDeck, ICountCard, IDeck, IUser } from '@models';
import { DialogStore, SaveStore } from '@store';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { DeckContainerComponent } from '../../shared/deck-container.component';
import { DecksTableComponent } from './decks-table.component';

@Component({
  selector: 'digimon-decks',
  template: `
    @if (!displayTables()) {
      <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-2">
        <digimon-deck-container
          class="mx-auto min-w-[280px] max-w-[285px]"
          (click)="showDeckDialog(deck)"
          (contextmenu)="showDeckDialog(deck)"
          *ngFor="let deck of decksToShow"
          [deck]="deck">
        </digimon-deck-container>
      </div>

      <div class="flex justify-center w-full">
        <p-paginator
          (onPageChange)="onPageChange($event)"
          [first]="first"
          [rows]="row"
          [showJumpToPageDropdown]="true"
          [showPageLinks]="false"
          [totalRecords]="decks.length"
          class="surface-card mx-auto h-8"
          styleClass="surface-card p-0"></p-paginator>
      </div>
    } @else {
      <digimon-decks-table [decks]="decks" (onDeckClick)="showDeckDialog($event)"></digimon-decks-table>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, DeckContainerComponent, PaginatorModule, DecksTableComponent, DialogModule],
})
export class DecksComponent implements OnInit, OnChanges {
  @Input() decks: IDeck[];
  @Input() editable = true;

  saveStore = inject(SaveStore);
  dialogStore = inject(DialogStore);

  row = 24;

  decksToShow: IDeck[] = [];

  collection: ICountCard[];
  user: IUser;

  first = 0;
  page = 0;

  deck: IDeck = JSON.parse(JSON.stringify(emptyDeck));

  displayTables = computed(() => this.saveStore.settings().deckDisplayTable);
  effect = effect(() => {
    console.log('Display Table: ' + this.displayTables());
  });

  ngOnInit() {
    if (!this.decks) {
      this.decks = [];
    }

    this.checkScreenWidth(window.innerWidth);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['decks']?.currentValue) {
      this.decksToShow = changes['decks'].currentValue.slice(0, this.row);
    }
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
      this.row = 24;
    } else if (lg) {
      this.row = 18;
    } else if (md) {
      this.row = 12;
    } else {
      this.row = 6;
    }
    this.decksToShow = this.decks.slice(0, this.row);
  }

  showDeckDialog(deck: IDeck) {
    this.dialogStore.updateDeckDialog({
      show: true,
      editable: true,
      deck,
    });
  }

  onPageChange(event: any, slice?: number) {
    this.first = event.first;
    this.page = event.page;
    this.decksToShow = this.decks.slice(event.first, (slice ?? this.row) * (event.page + 1));
  }
}
