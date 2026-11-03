import { CurrencyPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { emptySave, PriceMetric } from '@models';
import { setCompletion } from '@functions';
import { MongoBackendService, SeoService } from '@services';
import { DialogStore, DigimonCardStore, FilterStore, SaveStore } from '@store';
import { CardMarketService } from '../../services/card-market.service';
import { PageComponent } from '../shared/page.component';
import { PaginationCardListComponent } from './components/pagination-card-list.component';

@Component({
  selector: 'digimon-collection-page',
  template: `
    @if (urlCollection(); as collection) {
      <digimon-page>
        <digimon-pagination-card-list
          [collectionOnly]="true"
          [inputCollection]="collection"
          [showCollectionMode]="false"
          [alwaysCollection]="true"
          class="w-screen flex flex-row h-[calc(100vh-7.5rem)] md:h-[calc(100vh-5rem)]">
          <div headerStart role="group" aria-label="Show cards" class="inline-flex gap-1 rounded-full border border-line bg-ink-1 p-0.5">
            @for (option of ownedOptions; track option.label) {
              <button
                type="button"
                (click)="showOwned(option.range)"
                [attr.aria-pressed]="ownedFilter() === option.label"
                class="rounded-full px-3 py-0.5 text-xs"
                [ngClass]="ownedFilter() === option.label ? 'bg-accent text-accent-ink font-semibold' : 'text-fg'">
                {{ option.label }}
              </button>
            }
          </div>
          @if (own) {
            <button headerEnd type="button" (click)="openImportExport()" class="h-8 rounded-lg border border-line bg-ink-2 px-3 text-xs font-semibold text-fg hover:border-accent">
              <i class="pi pi-sort-alt mr-1"></i> Import / Export
            </button>
          }
          <section aria-label="Collection summary" class="w-full flex flex-wrap items-center gap-2 px-1 pt-2">
            @for (stat of stats(); track stat.label) {
              <div class="min-w-[9rem] flex-1 rounded-lg border border-line bg-ink-1 px-4 py-3">
                <div class="text-[11px] font-semibold uppercase tracking-wider text-muted">{{ stat.label }}</div>
                <div class="font-mono text-2xl font-semibold text-fg">{{ stat.value }}</div>
              </div>
            }
          </section>
          <div class="flex w-full flex-wrap items-baseline justify-between gap-2 px-1 pt-3">
            <h2 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Set completion</h2>
            <span class="text-xs text-muted">
              {{ goalSummary() }} ·
              @if (own) {
                <button type="button" (click)="openImportExport()" class="text-accent hover:underline">change in Settings</button>
              } @else {
                using your settings
              }
            </span>
          </div>
          <section
            aria-label="Sets in progress"
            class="w-full grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2 overflow-hidden px-1 pt-2"
            [style.max-height]="showAllSets() ? null : '11.75rem'">
            @for (set of openSets(); track set.set) {
              <div class="rounded-lg border border-line bg-ink-1 p-3 flex flex-col gap-2">
                <div class="flex justify-between font-mono text-sm">
                  <span class="font-semibold text-fg">{{ set.set }}</span>
                  <span class="text-muted">{{ set.percent }}%</span>
                </div>
                <div class="h-1.5 rounded bg-line overflow-hidden">
                  <div class="h-full bg-accent" [style.width.%]="set.percent"></div>
                </div>
                <span class="font-mono text-xs text-muted">{{ set.owned }} / {{ set.total }}</span>
              </div>
            } @empty {
              <span class="col-span-full text-sm text-muted">Every tracked set is complete.</span>
            }
          </section>
          @if (openSets().length > 12) {
            <button type="button" (click)="showAllSets.set(!showAllSets())" class="mx-1 mt-1 w-full text-left text-sm text-accent hover:underline">
              {{ showAllSets() ? 'Show fewer sets' : 'Show all ' + openSets().length + ' sets in progress' }}
            </button>
          }
          @if (completedSets().length) {
            <section aria-label="Completed sets" class="mx-1 mb-2 mt-2 w-full rounded-lg border border-green-500/30 bg-ink-1">
              <button
                type="button"
                (click)="showCompleted.set(!showCompleted())"
                [attr.aria-expanded]="showCompleted()"
                class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-fg">
                <i class="pi pi-check-circle text-green-400"></i>
                Completed
                <span class="font-mono text-xs text-muted">{{ completedSets().length }}</span>
                <i class="pi ml-auto text-xs text-muted" [ngClass]="showCompleted() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
              </button>
              @if (showCompleted()) {
                <div class="flex flex-wrap gap-1.5 px-3 pb-3">
                  @for (set of completedSets(); track set.set) {
                    <span class="inline-flex items-center gap-1 rounded-full border border-green-500/40 bg-ink-2 px-2.5 py-0.5 font-mono text-xs text-green-300">
                      <i class="pi pi-check text-[10px]"></i>{{ set.set }}
                      <span class="text-muted">{{ set.total }}</span>
                    </span>
                  }
                </div>
              }
            </section>
          }
        </digimon-pagination-card-list>
      </digimon-page>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PaginationCardListComponent, PageComponent, NgClass],
  providers: [CurrencyPipe],
})
export class CollectionPageComponent {
  private seo = inject(SeoService);

  private mongoBackendService = inject(MongoBackendService);
  private route = inject(ActivatedRoute);

  // Check the URL if another Save should be loaded
  checkUrl$ = this.route.params.pipe(
    switchMap((params) => {
      if (params['userId']) {
        return this.mongoBackendService.getSave(params['userId']);
      } else {
        return of(emptySave);
      }
    }),
    map((save) => save.collection),
  );
  urlCollection = toSignal(this.checkUrl$);

  private digimonCardStore = inject(DigimonCardStore);
  private saveStore = inject(SaveStore);

  private filterStore = inject(FilterStore);
  private dialogStore = inject(DialogStore);
  private cardMarketService = inject(CardMarketService);
  private currency = inject(CurrencyPipe);

  own = !this.route.snapshot.params['userId'];
  showAllSets = signal(false);
  private collection = computed(() => (this.own ? this.saveStore.collection() : (this.urlCollection() ?? [])));

  stats = computed(() => {
    const owned = this.collection().filter((card) => card.count > 0);
    const metric = (this.saveStore.settings().priceMetric as PriceMetric) || PriceMetric.Trend;
    const value = this.cardMarketService.calculateTotalValue(owned, metric);
    return [
      { label: 'Unique cards', value: owned.length },
      { label: 'Total copies', value: owned.reduce((sum, card) => sum + card.count, 0) },
      { label: 'Playsets (4+)', value: owned.filter((card) => card.count >= 4).length },
      { label: 'Value', value: value ? this.currency.transform(value, 'EUR') : '—' },
    ];
  });

  // Shortcuts for the "Number in Collection" filter
  private countMax = computed(() => this.saveStore.settings().countMax ?? 5);
  ownedOptions = [
    { label: 'All', range: 'all' },
    { label: 'Owned', range: 'owned' },
    { label: 'Missing', range: 'missing' },
  ] as const;
  ownedFilter = computed(() => {
    const [min, max] = this.filterStore.filter().cardCountFilter;
    if (min === 0 && max === 0) return 'Missing';
    if (min === 1 && max === this.countMax()) return 'Owned';
    if (min === 0 && max === this.countMax()) return 'All';
    return '';
  });

  showOwned(range: 'all' | 'owned' | 'missing') {
    const max = this.countMax();
    const cardCountFilter = range === 'missing' ? [0, 0] : [range === 'owned' ? 1 : 0, max];
    this.filterStore.updateFilter({ ...this.filterStore.filter(), cardCountFilter });
  }

  openImportExport() {
    this.dialogStore.updateSettingsDialog(true);
  }

  showCompleted = signal(false);

  sets = computed(() => {
    const settings = this.saveStore.settings();
    return setCompletion(this.digimonCardStore.cards(), this.collection(), settings).map((set) => ({
      ...set,
      percent: Math.floor((set.owned / set.total) * 100),
    }));
  });
  openSets = computed(() => this.sets().filter((set) => set.owned < set.total));
  completedSets = computed(() => this.sets().filter((set) => set.owned >= set.total));

  goalSummary = computed(() => {
    const { collectionMinimum, aaCollectionMinimum, collectionSets } = this.saveStore.settings();
    const copies = `${Math.max(collectionMinimum, 1)} ${Math.max(collectionMinimum, 1) === 1 ? 'copy' : 'copies'} per card`;
    const aa = aaCollectionMinimum > 0 ? `alt arts at ${aaCollectionMinimum}` : 'alt arts ignored';
    const sets = collectionSets?.length ? `${collectionSets.length} tracked sets` : 'all sets';
    return `${copies}, ${aa}, ${sets}`;
  });

  constructor() {
    this.makeGoogleFriendly();
  }

  private makeGoogleFriendly() {
    this.seo.set('Collection tracker', 'Track your Digimon Card Game collection: owned cards, playsets, set completion and collection value.');
  }
}
