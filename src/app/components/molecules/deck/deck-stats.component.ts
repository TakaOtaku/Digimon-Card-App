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
      class="fixed bottom-0 z-[102] flex h-32 w-screen flex-row"
      [ngClass]="{ 'lg:w-[350px]': collectionView }"
    >
      <div
        class="surface-card flex w-full flex-row border-t-2 border-white bg-opacity-25"
      >
        <digimon-ddto-spread
          *ngIf="!collectionView"
          [deck]="deck"
          [allCards]="allCards"
          [container]="true"
          class="mx-5"
        ></digimon-ddto-spread>

        <digimon-chart-containers
          [deck]="mainDeck"
          class="max-w-[40rem]"
          [ngClass]="{
            'mr-auto md:ml-3': collectionView,
            'mx-auto': !collectionView
          }"
        ></digimon-chart-containers>

        <digimon-color-spread
          *ngIf="!collectionView"
          [deck]="deck"
          [allCards]="allCards"
          [container]="true"
          class="mx-5"
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
