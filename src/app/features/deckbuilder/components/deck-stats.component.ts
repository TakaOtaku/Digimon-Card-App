import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { IDeckCard } from '../../../../models';
import { mapToDeckCards } from '../../../functions/digimon-card.functions';
import { selectAllCards, selectDeck } from '../../../store/digimon.selectors';
import { ColorSpreadComponent } from '../../shared/statistics/color-spread.component';
import { ChartContainersComponent } from '../../shared/statistics/chart-containers.component';
import { DdtoSpreadComponent } from '../../shared/statistics/ddto-spread.component';
import { NgIf, NgClass, AsyncPipe } from '@angular/common';

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
          [deck]="this.deck$ | async"
          [allCards]="(this.allCards$ | async) ?? []"
          [container]="true"
          class="ml-auto hidden border-r border-slate-200 px-5 lg:block"></digimon-ddto-spread>

        <digimon-chart-containers
          [deck]="(mainDeck$ | async)!"
          class="max-w-[40rem]"
          [ngClass]="{
            'lg:ml-3 lg:mr-auto': collectionView
          }"></digimon-chart-containers>

        <digimon-color-spread
          *ngIf="!collectionView"
          [deck]="this.deck$ | async"
          [allCards]="(this.allCards$ | async) ?? []"
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
  @Input() showStats = false;
  @Input() collectionView = false;

  deck$ = this.store.select(selectDeck);

  allCards$ = this.store.select(selectAllCards);

  mainDeck$: Observable<IDeckCard[]> = combineLatest(
    this.deck$,
    this.allCards$,
  ).pipe(map((value) => mapToDeckCards(value[0].cards, value[1])));

  constructor(private store: Store) {}
}
