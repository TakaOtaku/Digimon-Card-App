import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ICountCard, PriceMetric } from '../../models';
import { CardMarketService, ProductCM } from '../services/card-market.service';

type PriceState = {
  priceMap: Map<string, ProductCM>;
  loaded: boolean;
  createdAt: string | null;
};

const initialState: PriceState = {
  priceMap: new Map<string, ProductCM>(),
  loaded: false,
  createdAt: null,
};

export const PriceStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store, cardMarketService = inject(CardMarketService)) => ({
    initialize(): void {
      cardMarketService.priceMap$.subscribe((priceMap) => {
        patchState(store, {
          priceMap,
          loaded: true,
          createdAt: cardMarketService.getCreatedAt(),
        });
      });
    },

    getPrice(cardId: string, metric: PriceMetric): number | null {
      return cardMarketService.getPrice(cardId, metric);
    },

    getPriceData(cardId: string): ProductCM | null {
      return cardMarketService.getPriceData(cardId);
    },

    calculateCollectionValue(collection: ICountCard[], metric: PriceMetric): number {
      return cardMarketService.calculateTotalValue(collection, metric);
    },

    calculateDeckValue(cards: ICountCard[], metric: PriceMetric): number {
      return cardMarketService.calculateTotalValue(cards, metric);
    },
  })),
);
