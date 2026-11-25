import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { DeckFormat, emptyFilter, IFilter } from '../../models';

type FilterStore = {
  filter: IFilter;
  advancedSearch: string | null;
  format: DeckFormat;
  otherFilter: IFilter; // the filter of the mode that is not shown
};

const initialState: FilterStore = {
  filter: emptyFilter,
  advancedSearch: null,
  format: 'paper',
  otherFilter: emptyFilter,
};

export const FilterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ filter, advancedSearch }) => ({
    searchFilter: computed(() => filter.searchFilter()),
    colorFilter: computed(() => filter.colorFilter()),
    cardTypeFilter: computed(() => filter.cardTypeFilter()),
    blockFilter: computed(() => filter.blockFilter()),
    rarityFilter: computed(() => filter.rarityFilter()),
    versionFilter: computed(() => filter.versionFilter()),
    setFilter: computed(() => filter.setFilter()),
    advancedSearchActive: computed(() => advancedSearch() !== null && advancedSearch()!.trim() !== ''),
  })),

  withMethods((store) => ({
    switchFormat(format: DeckFormat): void {
      if (store.format() === format) return;
      patchState(store, (state) => ({ format, filter: state.otherFilter, otherFilter: state.filter, advancedSearch: null }));
    },
    updateFilter(filter: IFilter): void {
      patchState(store, (state) => ({ filter }));
    },
    updateSearchFilter(searchFilter: string): void {
      patchState(store, (state) => ({
        filter: { ...state.filter, searchFilter },
      }));
    },
    updateColorFilter(colorFilter: string[]): void {
      patchState(store, (state) => ({
        filter: { ...state.filter, colorFilter },
      }));
    },
    updateCardTypeFilter(cardTypeFilter: string[]): void {
      patchState(store, (state) => ({
        filter: { ...state.filter, cardTypeFilter },
      }));
    },
    updateBlockFilter(blockFilter: string[]): void {
      patchState(store, (state) => ({
        filter: { ...state.filter, blockFilter },
      }));
    },
    updateRarityFilter(rarityFilter: string[]): void {
      patchState(store, (state) => ({
        filter: { ...state.filter, rarityFilter },
      }));
    },
    updateVersionFilter(versionFilter: string[]): void {
      patchState(store, (state) => ({
        filter: { ...state.filter, versionFilter },
      }));
    },
    updateSetFilter(setFilter: string[]): void {
      patchState(store, (state) => ({
        filter: { ...state.filter, setFilter },
      }));
    },
    updateAdvancedSearch(advancedSearch: string | null): void {
      patchState(store, (state) => ({ advancedSearch }));
    },
    clearAdvancedSearch(): void {
      patchState(store, (state) => ({ advancedSearch: null }));
    },
  })),
);
