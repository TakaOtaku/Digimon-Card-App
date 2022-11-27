import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
        *ngFor="let deck of decks"
        [deck]="deck"
      ></digimon-deck-container>
    </div>

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
export class DecksComponent {
  @Input() decks: IDeck[];
  @Input() editable = true;

  emptyDeck = emptyDeck;

  allCards: ICard[] = [];

  collection: ICountCard[];
  user: IUser;

  correctUser = false;
  params = '';

  deck: IDeck;
  deckDialog = false;

  showDeckDialog(deck: IDeck) {
    this.deck = deck;
    this.deckDialog = true;
  }
}
