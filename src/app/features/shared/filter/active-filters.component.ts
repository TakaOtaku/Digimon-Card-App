import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { emptyFilter, IFilter } from '@models';
import { FilterStore } from '@store';

const LABELS: Record<string, string> = {
  searchFilter: 'Text',
  setFilter: 'Set',
  cardCountFilter: 'Owned',
  levelFilter: 'Level',
  playCostFilter: 'Play cost',
  digivolutionFilter: 'Digivolution cost',
  dpFilter: 'DP',
  priceFilter: 'Price',
  rarityFilter: 'Rarity',
  versionFilter: 'Version',
  keywordFilter: 'Keyword',
  formFilter: 'Form',
  attributeFilter: 'Attribute',
  typeFilter: 'Type',
  colorFilter: 'Color',
  cardTypeFilter: 'Card type',
  illustratorFilter: 'Illustrator',
  specialRequirementsFilter: 'Requirement',
  blockFilter: 'Block',
  restrictionsFilter: 'Restriction',
  sourceFilter: 'Source',
  presetFilter: 'Preset',
};

interface ActiveFilter {
  key: string;
  label: string;
}

/** The filters that differ from the empty filter, each removable on its own. */
@Component({
  selector: 'digimon-active-filters',
  template: `
    @if (active().length || query()) {
      <div class="flex flex-wrap items-center gap-1 px-2 pb-1" role="group" aria-label="Active filters">
        @if (query(); as q) {
          <button type="button" (click)="clearQuery()" class="inline-flex h-8 items-center gap-1.5 rounded-full border border-accent bg-ink-2 px-3 text-xs text-fg" [attr.aria-label]="'Remove search ' + q">
            <span class="max-w-[16rem] truncate font-mono">{{ q }}</span><i class="pi pi-times text-[10px]"></i>
          </button>
        }
        @for (item of active(); track item.key) {
          <button type="button" (click)="remove(item.key)" class="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-ink-2 px-3 text-xs text-fg hover:border-accent" [attr.aria-label]="'Remove filter ' + item.label">
            <span class="max-w-[16rem] truncate">{{ item.label }}</span><i class="pi pi-times text-[10px]"></i>
          </button>
        }
        <button type="button" (click)="clearAll()" class="h-8 rounded-full px-3 text-xs font-semibold text-accent hover:underline">Clear all</button>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ActiveFiltersComponent {
  private filterStore = inject(FilterStore);

  query = computed(() => (this.filterStore.advancedSearch() ?? '').trim());

  active = computed<ActiveFilter[]>(() => {
    const filter = this.filterStore.filter() as unknown as Record<string, unknown>;
    const empty = emptyFilter as unknown as Record<string, unknown>;
    return Object.keys(LABELS)
      .filter((key) => JSON.stringify(filter[key] ?? empty[key]) !== JSON.stringify(empty[key]))
      .map((key) => {
        const value = filter[key];
        const text = Array.isArray(value) ? (typeof value[0] === 'number' ? value.join('–') : value.join(', ')) : String(value);
        return { key, label: `${LABELS[key]}: ${text}` };
      });
  });

  remove(key: string) {
    const filter = this.filterStore.filter() as unknown as Record<string, unknown>;
    const empty = emptyFilter as unknown as Record<string, unknown>;
    this.filterStore.updateFilter({ ...filter, [key]: empty[key] } as unknown as IFilter);
  }

  clearQuery() {
    this.filterStore.clearAdvancedSearch();
  }

  clearAll() {
    this.filterStore.updateFilter(emptyFilter as unknown as IFilter);
    this.filterStore.clearAdvancedSearch();
  }
}
