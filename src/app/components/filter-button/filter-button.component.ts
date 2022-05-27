import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { ICard, ICountCard, IDeckCard } from '../../../models';
import { compareIDs } from '../../functions/digimon-card.functions';
import { selectAllCards } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-filter-button',
  templateUrl: './filter-button.component.html',
})
export class FilterButtonComponent implements OnInit, OnDestroy {
  @Input() mainDeck: IDeckCard[];

  sidebar = false;

  private allCards: ICard[];
  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select(selectAllCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allCards: ICard[]) => (this.allCards = allCards));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

  /**
   * Increase the Card Count but check for Eosmon
   */
  onCardClick(id: string) {
    const alreadyInDeck = this.mainDeck.find((value) =>
      compareIDs(value.id, id)
    );
    const card = this.allCards.find((card) => compareIDs(card.id, id));
    if (alreadyInDeck) {
      if (card!.cardNumber === 'BT6-085' || card!.cardNumber === 'EX2-046') {
        alreadyInDeck.count =
          alreadyInDeck.count >= 50 ? 50 : alreadyInDeck.count + 1;
        this.mapToDeck();
        return;
      }
      alreadyInDeck.count =
        alreadyInDeck.count === 4 ? 4 : alreadyInDeck.count + 1;
      this.mapToDeck();
      return;
    }

    this.mainDeck.push({ ...card!, count: 1 });
    this.mapToDeck();
  }

  mapToDeck() {}
}
