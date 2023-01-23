import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { ICard, IDeck, IDeckCard } from '../../../../models';
import { mapToDeckCards } from '../../../functions/digimon-card.functions';
import { ProductCM } from '../../../service/card-market.service';
import { DeckBuilderViewModel } from '../../../store/digimon.selectors';

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
          [deck]="this.deckBuilderViewModel.deck"
          [allCards]="deckBuilderViewModel.cards"
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
          [deck]="this.deckBuilderViewModel.deck"
          [allCards]="deckBuilderViewModel.cards"
          [container]="true"
          class="mr-auto hidden border-l border-slate-200 px-5 lg:block"
        ></digimon-color-spread>
      </div>
    </div>
  `,
})
export class DeckStatsComponent implements OnChanges {
  @Input() showStats = false;
  @Input() collectionView = false;
  @Input() deckBuilderViewModel: DeckBuilderViewModel;

  mainDeck: IDeckCard[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['deckBuilderViewModel']) {
      if (this.deckBuilderViewModel.deck) {
        this.mainDeck = mapToDeckCards(
          this.deckBuilderViewModel.deck.cards,
          this.deckBuilderViewModel.cards
        );
      }
    }
  }
}
