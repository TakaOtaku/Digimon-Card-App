import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ICard, IDeck, IDeckCard } from '../../../../models';
import { setDeck } from '../../../store/digimon.actions';
import { selectAllCards } from '../../../store/digimon.selectors';
import { emptyDeck } from '../../../store/reducers/digimon.reducers';

@Component({
  selector: 'digimon-deck-toolbar',
  templateUrl: './deck-toolbar.component.html',
})
export class DeckToolbarComponent implements OnDestroy {
  @Input() deck: IDeck;
  @Input() mainDeck: IDeckCard[];
  @Input() missingCards: boolean;

  @Output() share = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();
  @Output() delete = new EventEmitter<boolean>();

  importDeckDialog = false;
  exportDeckDialog = false;

  securityStack: ICard[];
  drawHand: ICard[];
  allDeckCards: ICard[];
  didMulligan = false;
  simulateDialog = false;

  private allCards: ICard[];
  private destroy$ = new Subject<boolean>();

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private store: Store
  ) {
    this.store
      .select(selectAllCards)
      .pipe(takeUntil(this.destroy$))
      .subscribe((allCards) => (this.allCards = allCards));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  /**
   * Get Count of how many Cards are in the Main-Deck or Egg Deck
   */
  getCardCount(which: string): number {
    let count = 0;
    if (which === 'Egg') {
      this.mainDeck.forEach((card) => {
        if (card.cardLv === 'Lv.2') {
          count += card.count;
        }
      });
    } else {
      this.mainDeck.forEach((card) => {
        if (card.cardLv !== 'Lv.2') {
          count += card.count;
        }
      });
    }

    return count;
  }

  newDeck() {
    this.confirmationService.confirm({
      key: 'NewDeck',
      message:
        'You are about to clear all cards in the deck and make a new one. Are you sure?',
      accept: () => {
        const deck: IDeck = emptyDeck;
        this.store.dispatch(setDeck({ deck }));
        this.messageService.add({
          severity: 'success',
          summary: 'Deck cleared!',
          detail: 'Deck-Cards were cleared successfully!',
        });
      },
    });
  }

  //region Simulate Card Draw and Security Stack
  simulate() {
    this.simulateDialog = true;
    this.resetSimulation();
  }

  mulligan() {
    if (this.didMulligan) {
      this.messageService.add({
        severity: 'warn',
        summary: 'You already did a Mulligan!',
        detail: 'You can only mulligan once, before resetting.',
      });
      return;
    }

    this.drawHand = this.allDeckCards.slice(10, 15);

    this.didMulligan = true;
  }

  resetSimulation() {
    this.didMulligan = false;

    this.allDeckCards = DeckToolbarComponent.shuffle(
      this.deck.cards.map((card) => this.allCards.find((a) => a.id === card.id))
    );
    this.allDeckCards = this.allDeckCards.filter(
      (card) => card.cardType !== 'Digi-Egg'
    );

    this.securityStack = this.allDeckCards.slice(0, 5);
    this.drawHand = this.allDeckCards.slice(5, 10);
  }

  private static shuffle(array: any[]) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
  //endregion
}
