import { Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subject, takeUntil } from 'rxjs';
import { ICard, IDeck, IDeckCard } from '../../../../models';
import { mapToDeckCards } from '../../../functions/digimon-card.functions';
import {
  selectAllCards,
  selectDeckBuilderViewModel,
} from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-deck-stats',
  template: `
    <!-- Deck Stats -->
    <div
      *ngIf="showStats"
      class="fixed bottom-0 z-[102] flex h-28 w-full flex-row"
      [ngClass]="{ 'lg:w-[350px]': collectionView }"
    >
      <div
        [ngClass]="{ 'w-full': collectionView, 'border-l-2': !collectionView }"
        class="surface-card flex flex-row border-t-2 border-r-2 border-white bg-opacity-25 lg:mx-auto"
      >
        <digimon-ddto-spread
          *ngIf="!collectionView"
          [deck]="deck"
          [allCards]="allCards"
          [container]="true"
          class="ml-auto hidden border-r border-slate-200 px-5 lg:block"
        ></digimon-ddto-spread>

        <digimon-chart-containers
          [deck]="mainDeck"
          class="max-w-[40rem]"
          [ngClass]="{
            'lg:ml-3 lg:mr-auto': collectionView
          }"
        ></digimon-chart-containers>

        <digimon-color-spread
          *ngIf="!collectionView"
          [deck]="deck"
          [allCards]="allCards"
          [container]="true"
          class="mr-auto hidden border-l border-slate-200 px-5 lg:block"
        ></digimon-color-spread>
      </div>
    </div>
  `,
})
export class DeckStatsComponent implements OnDestroy {
  @Input() showStats = false;
  @Input() collectionView = false;

  mainDeck: IDeckCard[];

  deck: IDeck;
  allCards: ICard[];

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
        this.deck = deck;
        this.mainDeck = mapToDeckCards(deck.cards, cards);
      });
    this.store
      .select(selectAllCards)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((value) => !!value)
      )
      .subscribe((cards) => (this.allCards = cards));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }
}
