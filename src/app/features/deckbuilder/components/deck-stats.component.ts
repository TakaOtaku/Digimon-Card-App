import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, computed, effect, inject, Input, Signal } from '@angular/core';
import { IDeck, IDeckCard } from '../../../../models';
import { mapToDeckCards } from '../../../functions';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { WebsiteStore } from '../../../store/website.store';
import { ChartContainersComponent } from '../../shared/statistics/chart-containers.component';
import { ColorSpreadComponent } from '../../shared/statistics/color-spread.component';
import { DdtoSpreadComponent } from '../../shared/statistics/ddto-spread.component';

@Component({
  selector: 'digimon-deck-stats',
  template: `
    <!-- Deck Stats -->
    <div
      *ngIf="showStats"
      class="fixed bottom-0 z-[102] flex h-28 w-full flex-row"
      [ngClass]="{ 'lg:w-[350px]': collectionView }">
      <div
        [ngClass]="{ 'w-full': collectionView, 'border-l-2': !collectionView }"
        class="surface-card flex flex-row border-r-2 border-t-2 border-white bg-opacity-25 lg:mx-auto">
        <digimon-ddto-spread
          *ngIf="!collectionView"
          [deck]="deck()"
          [container]="true"
          class="ml-auto hidden border-r border-slate-200 px-5 lg:block"></digimon-ddto-spread>

        <digimon-chart-containers
          [deck]="mainDeck()"
          class="max-w-[40rem]"
          [ngClass]="{
            'lg:ml-3 lg:mr-auto': collectionView
          }"></digimon-chart-containers>

        <digimon-color-spread
          *ngIf="!collectionView"
          [deck]="deck()"
          [container]="true"
          class="mr-auto hidden border-l border-slate-200 px-5 lg:block"></digimon-color-spread>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    DdtoSpreadComponent,
    ChartContainersComponent,
    ColorSpreadComponent,
    AsyncPipe,
  ],
})
export class DeckStatsComponent {
  @Input() showStats = true;
  @Input() collectionView = false;

  websiteStore = inject(WebsiteStore);
  digimonCardStore = inject(DigimonCardStore);

  deck: Signal<IDeck> = this.websiteStore.deck;
  mainDeck: Signal<IDeckCard[]> = computed(() =>
    mapToDeckCards(
      this.websiteStore.deck().cards,
      this.digimonCardStore.cards(),
    ),
  );
}
