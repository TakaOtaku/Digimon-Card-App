import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, Output, Signal } from '@angular/core';
import { IDeck, IDeckCard } from '../../../../models';
import { deckChecks, mapToDeckCards, missingCards } from '../../../functions';
import { PriceMetric } from '@models';
import { SaveStore } from '@store';
import { MessageService } from 'primeng/api';
import { CardMarketService } from '../../../services/card-market.service';
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
        @if (hideable) {
          <div class="flex items-center justify-between">
            <h2 class="m-0 font-display text-lg font-semibold text-fg">Deck stats</h2>
            <button type="button" (click)="hide.emit()" class="flex h-8 items-center gap-1.5 rounded-lg border border-line bg-ink-2 px-3 text-xs font-semibold text-fg hover:border-accent" aria-label="Hide deck stats">
              Hide <i class="pi pi-angle-double-right"></i>
            </button>
          </div>
        }
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
          @if (colorShares().length) {
            <div class="flex h-3 overflow-hidden rounded-full">
              @for (share of colorShares(); track share.color) {
                <span [ngClass]="share.color" [style.flex]="share.count"></span>
              }
            </div>
            <span class="text-sm text-fg">{{ colorSummary() }}</span>
          }
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
        <section class="flex flex-col gap-2">
          <h3 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Collection</h3>
          @if (missing().length) {
            <span class="text-sm text-fg">Missing {{ missingTotal() }} cards for this deck.</span>
            <button type="button" (click)="copyMissing()" class="h-10 rounded-lg border border-line bg-ink-2 text-sm font-semibold text-fg hover:border-accent">
              Copy missing list
            </button>
          } @else {
            <span class="text-sm text-fg">You own every card in this deck.</span>
          }
        </section>
        <section class="flex flex-col gap-1">
          <h3 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Price estimate</h3>
          <span class="font-mono text-2xl font-semibold text-fg">{{ price() ? (price() | currency: 'EUR') : '—' }}</span>
        </section>
      </div>
    }
    <!-- Deck Stats -->
    <div *ngIf="showStats && !column" class="fixed bottom-16 md:bottom-0 z-[102] flex h-28 w-full flex-row" [ngClass]="{ 'lg:w-[350px]': collectionView }">
      <div
        [ngClass]="{ 'w-full': collectionView, 'border-l-2': !collectionView }"
        class="surface-card relative flex flex-row border-r-2 border-t-2 border-white bg-opacity-25 lg:mx-auto">
        @if (hideable) {
          <button type="button" (click)="hide.emit()" class="absolute right-1 top-1 z-10 flex h-8 items-center gap-1.5 rounded-lg border border-line bg-ink-2 px-2 text-xs font-semibold text-fg hover:border-accent" aria-label="Hide deck stats">
            Hide <i class="pi pi-angle-double-down"></i>
          </button>
        }
        <digimon-ddto-spread
          *ngIf="!collectionView"
          [deck]="deck()"
          [container]="true"
          class="ml-auto hidden border-r border-line px-5 lg:block"></digimon-ddto-spread>

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
          class="mr-auto hidden border-l border-line px-5 lg:block"></digimon-color-spread>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgIf, NgClass, CurrencyPipe, DdtoSpreadComponent, ChartContainersComponent, ColorSpreadComponent],
})
export class DeckStatsComponent {
  @Input() showStats = true;
  @Input() collectionView = false;
  @Input() column = false;
  // Stats the user can hide again from inside the panel (desktop); the phone Stats tab is not hideable
  @Input() hideable = false;
  @Output() hide = new EventEmitter<void>();

  websiteStore = inject(WebsiteStore);
  digimonCardStore = inject(DigimonCardStore);

  deck: Signal<IDeck> = this.websiteStore.deck;
  mainDeck: Signal<IDeckCard[]> = computed(() => mapToDeckCards(this.websiteStore.deck().cards, this.digimonCardStore.cards()));
  checks = computed(() => deckChecks(this.mainDeck()));

  private saveStore = inject(SaveStore);
  private cardMarketService = inject(CardMarketService);
  private messageService = inject(MessageService);

  // Multi-color cards count toward each of their colors
  colorShares = computed(() => {
    const counts = new Map<string, number>();
    this.mainDeck().forEach((card) =>
      (card.color ?? '').split('/').forEach((color) => color && counts.set(color.trim(), (counts.get(color.trim()) ?? 0) + card.count)),
    );
    return ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Purple', 'White']
      .filter((color) => counts.has(color))
      .map((color) => ({ color, count: counts.get(color)! }));
  });
  colorSummary = computed(() => this.colorShares().map((s) => `${s.color} ${s.count}`).join(' · '));

  missing = computed(() => missingCards(this.mainDeck(), this.saveStore.collection()));
  missingTotal = computed(() => this.missing().reduce((sum, m) => sum + m.need, 0));

  price = computed(() => {
    const metric = (this.saveStore.settings().priceMetric as PriceMetric) || PriceMetric.Trend;
    return this.cardMarketService.calculateTotalValue(this.deck().cards, metric);
  });

  copyMissing() {
    const text = this.missing()
      .map((m) => `${m.need} ${m.card.name.english} ${m.card.cardNumber}`)
      .join('\n');
    navigator.clipboard.writeText(text).then(
      () => this.messageService.add({ severity: 'success', summary: 'Missing cards copied' }),
      () => this.messageService.add({ severity: 'error', summary: 'Copy failed', detail: 'Your browser blocked clipboard access.' }),
    );
  }
}
