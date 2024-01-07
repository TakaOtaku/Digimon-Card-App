import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { DigimonCard, ICountCard, IDeck, IUser } from '../../../../models';
import { selectDeckDisplayTable } from '../../../store/digimon.selectors';
import { emptyDeck } from '../../../store/reducers/digimon.reducers';
import { DeckDialogComponent } from '../../shared/dialogs/deck-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { DecksTableComponent } from './decks-table.component';
import { PaginatorModule } from 'primeng/paginator';
import { DeckContainerComponent } from '../../shared/deck-container.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'digimon-decks',
  template: `
    <div *ngIf="(displayTables$ | async) === false; else deckTable">
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
    </div>

    <ng-template #deckTable>
      <digimon-decks-table
        [decks]="decks"
        (onDeckClick)="showDeckDialog($event)"></digimon-decks-table>
    </ng-template>

    <p-dialog
      header="Deck Details"
      [(visible)]="deckDialog"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000">
      <digimon-deck-dialog
        [deck]="deck"
        [editable]="editable"
        (closeDialog)="deckDialog = false"></digimon-deck-dialog>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DeckContainerComponent,
    PaginatorModule,
    DecksTableComponent,
    DialogModule,
    DeckDialogComponent,
    AsyncPipe,
  ],
})
export class DecksComponent implements OnInit, OnChanges {
  @Input() decks: IDeck[];
  @Input() editable = true;

  row = 24;

  decksToShow: IDeck[] = [];

  allCards: DigimonCard[] = [];

  collection: ICountCard[];
  user: IUser;

  params = '';

  first = 0;
  page = 0;

  deck: IDeck = JSON.parse(JSON.stringify(emptyDeck));
  deckDialog = false;

  displayTables$ = this.store.select(selectDeckDisplayTable);

  constructor(private store: Store) {}

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
    this.deck = deck;
    this.deckDialog = true;
  }

  onPageChange(event: any, slice?: number) {
    this.first = event.first;
    this.page = event.page;
    this.decksToShow = this.decks.slice(
      event.first,
      (slice ?? this.row) * (event.page + 1),
    );
  }
}
