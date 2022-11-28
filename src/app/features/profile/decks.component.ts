import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ICard, ICountCard, IDeck, IUser } from '../../../models';
import { emptyDeck } from '../../store/reducers/digimon.reducers';

@Component({
  selector: 'digimon-decks',
  template: `
    <div class="mx-auto grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      <digimon-deck-container
        class="max-w-[370px]"
        (click)="showDeckDialog(deck)"
        (contextmenu)="showDeckDialog(deck)"
        *ngFor="let deck of decksToShow"
        [deck]="deck"
      ></digimon-deck-container>
    </div>

    <p-paginator
      (onPageChange)="onPageChange($event)"
      [first]="first"
      [rows]="20"
      [showJumpToPageDropdown]="true"
      [showPageLinks]="false"
      [totalRecords]="decks.length"
      styleClass="border-0 bg-transparent mx-auto"
    ></p-paginator>

    <p-dialog
      header="Deck Details"
      [(visible)]="deckDialog"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000"
    >
      <digimon-deck-dialog
        [deck]="deck ?? emptyDeck"
        [editable]="editable"
        (closeDialog)="deckDialog = false"
      ></digimon-deck-dialog>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecksComponent implements OnInit, OnChanges {
  @Input() decks: IDeck[];
  @Input() editable = true;

  decksToShow: IDeck[] = [];

  emptyDeck = emptyDeck;

  allCards: ICard[] = [];

  collection: ICountCard[];
  user: IUser;

  correctUser = false;
  params = '';

  first = 0;
  page = 0;

  deck: IDeck;
  deckDialog = false;

  ngOnInit() {
    this.decksToShow = this.decks.slice(0, 20);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.decksToShow = changes['decks'].currentValue.slice(0, 20);
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
      (slice ?? 20) * (event.page + 1)
    );
  }
}
