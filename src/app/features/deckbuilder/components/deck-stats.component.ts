import { NgClass, NgIf } from '@angular/common';
import { Component, computed, inject, Input, Signal } from '@angular/core';
import { IDeck, IDeckCard } from '../../../../models';
import { deckChecks, mapToDeckCards } from '../../../functions';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { WebsiteStore } from '../../../store/website.store';
import { ChartContainersComponent } from '../../shared/statistics/chart-containers.component';
import { ColorSpreadComponent } from '../../shared/statistics/color-spread.component';
import { DdtoSpreadComponent } from '../../shared/statistics/ddto-spread.component';

@Component({
  selector: 'digimon-deck-stats',
  template: `
    @if (column) {
      <div class="flex flex-col gap-6 w-full">
        <section class="flex flex-col gap-2">
          <h3 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Level curve</h3>
          <digimon-chart-containers [deck]="mainDeck()"></digimon-chart-containers>
        </section>
        <section class="flex flex-col gap-2">
          <h3 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Card types</h3>
          <digimon-ddto-spread [deck]="deck()" [container]="true"></digimon-ddto-spread>
        </section>
        <section class="flex flex-col gap-2">
          <h3 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Colors</h3>
          <digimon-color-spread [deck]="deck()" [container]="true"></digimon-color-spread>
        </section>
        <section class="flex flex-col gap-2">
          <h3 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Deck check</h3>
          <ul class="m-0 p-0 list-none flex flex-col gap-2">
            @for (check of checks(); track check.label) {
              <li class="flex items-start gap-2 text-sm text-fg">
                <i [class]="check.ok ? 'pi pi-check-circle text-green-400' : 'pi pi-exclamation-circle text-yellow-400'" class="mt-0.5"></i>
                <span>{{ check.label }}</span>
              </li>
            }
          </ul>
        </section>
      </div>
    }
    <!-- Deck Stats -->
    <div *ngIf="showStats && !column" class="fixed bottom-16 md:bottom-0 z-[102] flex h-28 w-full flex-row" [ngClass]="{ 'lg:w-[350px]': collectionView }">
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
            'lg:ml-3 lg:mr-auto': collectionView,
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
  imports: [NgIf, NgClass, DdtoSpreadComponent, ChartContainersComponent, ColorSpreadComponent],
})
export class DeckStatsComponent {
  @Input() showStats = true;
  @Input() collectionView = false;
  @Input() column = false;

  websiteStore = inject(WebsiteStore);
  digimonCardStore = inject(DigimonCardStore);

  deck: Signal<IDeck> = this.websiteStore.deck;
  mainDeck: Signal<IDeckCard[]> = computed(() => mapToDeckCards(this.websiteStore.deck().cards, this.digimonCardStore.cards()));
  checks = computed(() => deckChecks(this.mainDeck()));
}
