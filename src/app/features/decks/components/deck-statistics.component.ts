import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { ImgFallbackDirective } from '@directives';
import { Subject, takeUntil } from 'rxjs';
import { IDeck } from '../../../../models';
import { cardUsage, CardUsage, isDigimonType } from '../../../functions/digimon-card.functions';
import { DigimonCardStore } from '../../../store/digimon-card.store';

const TYPES = ['All', 'Digimon', 'Tamer', 'Option', 'Digi-Egg'] as const;
const COLORS = ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Purple', 'White'];

@Component({
  selector: 'digimon-deck-statistics',
  template: `
    @if (!decks?.length) {
      <div class="flex flex-col items-center gap-2 py-12 text-center">
        <i class="pi pi-chart-bar text-4xl text-muted"></i>
        <p class="m-0 text-fg">No decks to analyse yet.</p>
        <p class="m-0 text-sm text-muted">Search or press Browse All, then open Statistics again.</p>
      </div>
    } @else {
      <div class="flex flex-col gap-5">
        <p class="m-0 text-sm text-muted">Based on the {{ decks.length }} decks in your current search.</p>

        <div class="grid grid-cols-2 gap-2 md:grid-cols-4">
          @for (tile of tiles; track tile.label) {
            <div class="rounded-lg border border-line bg-ink-1 px-4 py-3">
              <div class="text-[11px] font-semibold uppercase tracking-wider text-muted">{{ tile.label }}</div>
              <div class="truncate font-mono text-xl font-semibold text-fg">{{ tile.value }}</div>
            </div>
          }
        </div>

        @if (colorShares.length) {
          <section class="flex flex-col gap-2">
            <h3 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Deck colors</h3>
            <div class="flex h-3 overflow-hidden rounded-full">
              @for (share of colorShares; track share.color) {
                <span [ngClass]="share.color" [style.flex]="share.count" [title]="share.color + ' ' + share.count"></span>
              }
            </div>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg">
              @for (share of colorShares; track share.color) {
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2.5 w-2.5 rounded-full" [ngClass]="share.color"></span>{{ share.color }}
                  <span class="font-mono text-xs text-muted">{{ share.percent }}%</span>
                </span>
              }
            </div>
          </section>
        }

        <section class="flex flex-col gap-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Most played cards</h3>
            <div role="group" aria-label="Card type" class="flex flex-wrap gap-1">
              @for (t of types; track t) {
                <button
                  type="button"
                  (click)="type = t"
                  [attr.aria-pressed]="type === t"
                  class="h-8 rounded-full border px-3 text-xs font-semibold"
                  [ngClass]="type === t ? 'border-accent bg-ink-2 text-accent' : 'border-line bg-ink-2 text-fg'">
                  {{ t }}
                </button>
              }
            </div>
          </div>

          <ol class="m-0 flex max-h-[28rem] list-none flex-col gap-1 overflow-y-auto p-0">
            @for (row of rows(); track row.card.cardNumber; let i = $index) {
              <li class="flex items-center gap-3 rounded-lg bg-ink-2 py-1 pl-2 pr-3">
                <span class="w-6 text-right font-mono text-xs text-muted">{{ i + 1 }}</span>
                <img [digimonImgFallback]="row.card.cardImage" alt="" class="h-11 w-8 rounded object-cover" />
                <span class="flex min-w-0 flex-[1_1_10rem] flex-col">
                  <span class="truncate text-sm font-medium text-fg">{{ row.card.name.english }}</span>
                  <span class="font-mono text-[11px] text-muted">{{ row.card.cardNumber }}</span>
                </span>
                <span class="hidden flex-[1_1_8rem] items-center gap-2 sm:flex">
                  <span class="h-1.5 flex-1 overflow-hidden rounded bg-line"><span class="block h-full bg-accent" [style.width.%]="row.percent"></span></span>
                </span>
                <span class="w-14 text-right font-mono text-sm font-semibold text-fg" title="Share of decks that play it">{{ row.percent.toFixed(0) }}%</span>
                <span class="w-16 text-right font-mono text-xs text-muted" title="Average copies when played">avg {{ row.average.toFixed(1) }}×</span>
              </li>
            } @empty {
              <li class="p-2 text-sm text-muted">No {{ type }} cards in these decks.</li>
            }
          </ol>
        </section>
      </div>
    }
  `,
  standalone: true,
  imports: [NgClass, ImgFallbackDirective],
})
export class DeckStatisticsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() decks: IDeck[];
  @Input() updateCards: Subject<boolean>;
  @Input() loading: boolean;
  @Output() loadingChange = new EventEmitter<boolean>();

  types = TYPES;
  type: (typeof TYPES)[number] = 'All';
  usage: CardUsage[] = [];
  tiles: { label: string; value: string | number }[] = [];
  colorShares: { color: string; count: number; percent: number }[] = [];

  private digimonCardStore = inject(DigimonCardStore);
  private onDestroy$ = new Subject<void>();

  ngOnInit() {
    this.updateCards?.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.recalculate());
  }

  ngOnChanges() {
    this.recalculate();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  rows(): CardUsage[] {
    const rows =
      this.type === 'All'
        ? this.usage
        : this.usage.filter((row) => (this.type === 'Digimon' ? isDigimonType(row.card.cardType) : row.card.cardType === this.type));
    return rows.slice(0, 50);
  }

  private recalculate() {
    const decks = this.decks ?? [];
    this.usage = decks.length ? cardUsage(decks, this.digimonCardStore.cards()) : [];

    const colors = new Map<string, number>();
    decks.forEach((deck) => deck.color?.name && colors.set(deck.color.name, (colors.get(deck.color.name) ?? 0) + 1));
    this.colorShares = COLORS.filter((color) => colors.has(color)).map((color) => ({
      color,
      count: colors.get(color)!,
      percent: Math.round((colors.get(color)! / decks.length) * 100),
    }));

    const top = this.usage[0];
    const topColor = [...this.colorShares].sort((a, b) => b.count - a.count)[0];
    this.tiles = [
      { label: 'Decks analysed', value: decks.length },
      { label: 'Unique cards', value: this.usage.length },
      { label: 'Most played', value: top ? top.card.name.english : '—' },
      { label: 'Top color', value: topColor ? `${topColor.color} ${topColor.percent}%` : '—' },
    ];
    this.loadingChange.emit(false);
  }
}
