import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ImgFallbackDirective } from '@directives';
import { deckGroups, levelSort, mapToDeckCards, missingCards } from '@functions';
import { IDeck, IDeckCard, PriceMetric } from '@models';
import { MongoBackendService, SeoService } from '@services';
import { DialogStore, DigimonCardStore, SaveStore } from '@store';
import { MessageService } from 'primeng/api';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { CardMarketService } from '../../services/card-market.service';
import { ChartContainersComponent } from '../shared/statistics/chart-containers.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'digimon-deck-page',
  template: `
    <digimon-page>
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-5 self-start px-4 py-6 md:px-6">
        @if (deck() === undefined) {
          <p class="text-muted">Loading deck…</p>
        } @else if (deck() === null) {
          <div class="flex flex-col items-start gap-3 py-10">
            <h1 class="m-0 text-3xl font-bold text-fg">Deck not found</h1>
            <p class="m-0 text-muted">The link may be old, or the deck was deleted.</p>
            <a routerLink="/decks" class="text-accent">Browse community decks</a>
          </div>
        } @else {
          @let d = deck()!;
          <nav aria-label="Breadcrumb" class="text-sm text-muted">
            <a routerLink="/decks" class="text-accent no-underline hover:underline">Decks</a>
            @if (d.user) {
              / {{ d.user }}
            }
            / {{ d.title || 'Untitled deck' }}
          </nav>

          <section class="flex flex-wrap items-center gap-6 rounded-xl border border-line bg-ink-1 p-5">
            @if (leadCard(); as lead) {
              <img [digimonImgFallback]="lead.cardImage" [alt]="lead.name.english" class="w-24 shrink-0 rounded-lg" />
            }
            <div class="flex min-w-0 flex-[999_1_26rem] flex-col gap-3">
              <h1 class="m-0 text-4xl font-bold leading-tight text-fg">{{ d.title || 'Untitled deck' }}</h1>
              <div class="flex flex-wrap items-center gap-2 text-sm">
                @if (d.color?.name) {
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink-2 px-3 py-0.5 text-fg">
                    <span class="h-2.5 w-2.5 rounded-full" [ngClass]="d.color.name"></span>{{ d.color.name }}
                  </span>
                }
                @if (d.user) {
                  <span class="rounded-full border border-line bg-ink-2 px-3 py-0.5 text-fg">by {{ d.user }}</span>
                }
                <span class="rounded-full border border-line bg-ink-2 px-3 py-0.5 font-mono text-fg">{{ mainCount() }} + {{ eggCount() }}</span>
                @if (updated(); as date) {
                  <span class="rounded-full border border-line bg-ink-2 px-3 py-0.5 text-fg">Updated {{ date | date: 'mediumDate' }}</span>
                }
                @for (tag of d.tags; track tag.name) {
                  <span class="rounded-full border border-line bg-ink-2 px-3 py-0.5 text-fg">{{ tag.name }}</span>
                }
              </div>
              @if (d.description) {
                <p class="m-0 max-w-3xl whitespace-pre-wrap leading-relaxed text-muted">{{ d.description }}</p>
              }
            </div>
            <div class="flex flex-[1_1_16rem] flex-wrap justify-end gap-2">
              <a [routerLink]="['/deckbuilder', d.id]" class="inline-flex h-11 items-center rounded-lg bg-accent px-4 font-semibold text-accent-ink no-underline">Open in builder</a>
              <button type="button" (click)="copy(textList(), 'Deck list copied')" class="h-11 rounded-lg border border-line bg-ink-2 px-4 text-fg hover:border-accent">Copy list</button>
              <button type="button" (click)="export(d)" class="h-11 rounded-lg border border-line bg-ink-2 px-4 text-fg hover:border-accent">Export</button>
              <button type="button" (click)="copy(shareUrl(), 'Link copied')" aria-label="Copy link" class="h-11 w-11 rounded-lg border border-line bg-ink-2 text-fg hover:border-accent">
                <i class="pi pi-link"></i>
              </button>
            </div>
          </section>

          <div class="flex flex-wrap items-start gap-5">
            <section aria-label="Cards in deck" class="flex min-w-0 flex-[999_1_36rem] flex-col gap-6">
              @for (group of groups(); track group.title) {
                <div class="flex flex-col gap-3">
                  @if (group.title) {
                    <div class="flex items-baseline gap-2">
                      <h2 class="m-0 font-display text-xl font-semibold text-fg">{{ group.title }}</h2>
                      <span class="font-mono text-sm text-muted">{{ group.count }}</span>
                    </div>
                  }
                  <div class="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
                    @for (card of group.cards; track card.id) {
                      <div class="flex flex-col gap-1.5">
                        <div class="relative">
                          <img [digimonImgFallback]="card.cardImage" [alt]="card.cardNumber + ' ' + card.name.english" class="w-full rounded-lg" />
                          <span class="absolute bottom-1.5 right-1.5 rounded-md bg-accent px-1.5 font-mono text-sm font-semibold text-accent-ink">×{{ card.count }}</span>
                          @if (need(card) > 0) {
                            <span class="absolute left-1.5 top-1.5 rounded bg-orange-400 px-1.5 font-mono text-[11px] text-ink-0">need {{ need(card) }}</span>
                          }
                        </div>
                        <span class="truncate text-xs font-semibold text-fg">{{ card.name.english }}</span>
                      </div>
                    }
                  </div>
                </div>
              }
            </section>

            <aside class="flex min-w-0 flex-[1_1_18rem] flex-col gap-4">
              <section class="flex flex-col gap-2 rounded-xl border border-line bg-ink-1 p-4">
                <h2 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Level curve</h2>
                <digimon-chart-containers [deck]="cards()"></digimon-chart-containers>
              </section>
              <section class="flex flex-col gap-2 rounded-xl border border-line bg-ink-1 p-4">
                <h2 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Your collection</h2>
                <div class="flex items-baseline gap-2">
                  <span class="font-mono text-2xl font-semibold text-fg">{{ ownedCount() }}/{{ totalCount() }}</span>
                  <span class="text-sm text-muted">cards owned</span>
                </div>
                <div class="h-2 overflow-hidden rounded bg-line">
                  <div class="h-full bg-green-500" [style.width.%]="totalCount() ? (ownedCount() / totalCount()) * 100 : 0"></div>
                </div>
                @if (missingList()) {
                  <button type="button" (click)="copy(missingList(), 'Missing cards copied')" class="h-10 rounded-lg border border-line bg-ink-2 text-sm text-fg hover:border-accent">
                    Copy missing list
                  </button>
                }
              </section>
              <section class="flex flex-col gap-1 rounded-xl border border-line bg-ink-1 p-4">
                <h2 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Price estimate</h2>
                <span class="font-mono text-2xl font-semibold text-fg">{{ price() ? (price() | currency: 'EUR') : '—' }}</span>
              </section>
              <section class="flex flex-col gap-2 rounded-xl border border-line bg-ink-1 p-4">
                <h2 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Text list</h2>
                <pre class="m-0 max-h-60 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-fg">{{ textList() }}</pre>
              </section>
            </aside>
          </div>
        }
      </div>
    </digimon-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageComponent, RouterLink, NgClass, DatePipe, CurrencyPipe, ImgFallbackDirective, ChartContainersComponent],
})
export class DeckPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private backend = inject(MongoBackendService);
  private digimonCardStore = inject(DigimonCardStore);
  private saveStore = inject(SaveStore);
  private dialogStore = inject(DialogStore);
  private cardMarketService = inject(CardMarketService);
  private messageService = inject(MessageService);

  // undefined = loading, null = not found
  deck = toSignal(
    this.route.params.pipe(
      switchMap((params) =>
        this.backend.getDeck(params['id']).pipe(
          map((deck): IDeck | null => deck ?? null),
          catchError(() => of(null)),
          startWith(undefined),
        ),
      ),
    ),
  );

  cards = computed(() => {
    const deck = this.deck();
    return deck ? levelSort(mapToDeckCards(deck.cards, this.digimonCardStore.cards())) : [];
  });
  groups = computed(() => deckGroups(this.cards(), this.saveStore.settings().groupDeckByType !== false));
  mainCount = computed(() => this.cards().filter((c) => c.cardType !== 'Digi-Egg').reduce((sum, c) => sum + c.count, 0));
  eggCount = computed(() => this.cards().filter((c) => c.cardType === 'Digi-Egg').reduce((sum, c) => sum + c.count, 0));
  totalCount = computed(() => this.mainCount() + this.eggCount());
  leadCard = computed(() => {
    const deck = this.deck();
    return (deck && this.digimonCardStore.cardsMap().get(deck.imageCardId)) || this.cards()[0];
  });
  updated = computed(() => {
    const time = Date.parse(this.deck()?.date ?? '');
    return isNaN(time) ? null : new Date(time);
  });

  private missing = computed(() => new Map(missingCards(this.cards(), this.saveStore.collection()).map((m) => [m.card.id, m.need])));
  need = (card: IDeckCard) => this.missing().get(card.id) ?? 0;
  ownedCount = computed(() => this.cards().reduce((sum, c) => sum + c.count - this.need(c), 0));

  price = computed(() => {
    const deck = this.deck();
    const metric = (this.saveStore.settings().priceMetric as PriceMetric) || PriceMetric.Trend;
    return deck ? this.cardMarketService.calculateTotalValue(deck.cards, metric) : 0;
  });

  textList = computed(() => this.cards().map((c) => `${c.count} ${c.name.english} ${c.cardNumber}`).join('\n'));
  missingList = computed(() =>
    this.cards()
      .filter((c) => this.need(c) > 0)
      .map((c) => `${this.need(c)} ${c.name.english} ${c.cardNumber}`)
      .join('\n'),
  );
  shareUrl = computed(() => window.location.origin + this.router.url);

  private seo = inject(SeoService);

  constructor() {
    effect(() => {
      const deck = this.deck();
      if (!deck) return this.seo.set('Deck', 'A Digimon Card Game deck shared on digimoncard.app.');
      const title = deck.title || 'Untitled deck';
      const by = deck.user ? ` by ${deck.user}` : '';
      this.seo.set(`${title}${by}`, `${title}${by}: ${this.mainCount()} + ${this.eggCount()} card Digimon Card Game deck with level curve, price estimate and text list.`);
    });
  }

  copy(text: string, summary: string) {
    navigator.clipboard.writeText(text).then(
      () => this.messageService.add({ severity: 'success', summary }),
      () => this.messageService.add({ severity: 'error', summary: 'Copy failed', detail: 'Your browser blocked clipboard access.' }),
    );
  }

  export(deck: IDeck) {
    this.dialogStore.updateExportDeckDialog({ show: true, deck });
  }
}
