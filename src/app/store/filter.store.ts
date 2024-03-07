import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { emptyFilter, IFilter } from '../../models';

type FilterStore = {
  filter: IFilter;
};

const initialState: FilterStore = {
  filter: emptyFilter,
};

export const FilterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ filter }) => ({
    searchFilter: computed(() => filter.searchFilter()),
    colorFilter: computed(() => filter.colorFilter()),
    cardTypeFilter: computed(() => filter.cardTypeFilter()),
    blockFilter: computed(() => filter.blockFilter()),
    rarityFilter: computed(() => filter.rarityFilter()),
    versionFilter: computed(() => filter.versionFilter()),
    setFilter: computed(() => filter.setFilter()),
  })),

  withMethods((store) => ({
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
  })),
);
