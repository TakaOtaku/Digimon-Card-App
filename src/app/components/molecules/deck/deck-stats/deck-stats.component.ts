import { Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subject, takeUntil } from 'rxjs';
import { IDeckCard } from '../../../../../models';
import { mapToDeckCards } from '../../../../functions/digimon-card.functions';
import { selectDeckBuilderViewModel } from '../../../../store/digimon.selectors';

@Component({
  selector: 'digimon-deck-stats',
  templateUrl: './deck-stats.component.html',
})
export class DeckStatsComponent implements OnDestroy {
  @Input() showStats = false;
  @Input() collectionView = false;

  mainDeck: IDeckCard[];

  private onDestroy$ = new Subject<boolean>();

  constructor(private store: Store) {
    this.store
      .select(selectDeckBuilderViewModel)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((value) => !!value)
      )
      .subscribe(({ deck, cards }) => {
        if (!deck) {
          return;
        }
        this.mainDeck = mapToDeckCards(deck.cards, cards);
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }
}
