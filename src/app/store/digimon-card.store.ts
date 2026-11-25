import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { setupDigimonCardMap, setupDigimonCards } from '../../assets/cardlists/DigimonCards';
import { CARDSET, DeckFormat, DigimonCard } from '../../models';
import { poolFor } from '../functions/alysion.functions';

type DigimonCards = {
  cards: DigimonCard[];
  filteredCards: DigimonCard[];
  cardsMap: Map<string, DigimonCard>;
  format: DeckFormat;
};

const initialState: DigimonCards = {
  cards: [],
  filteredCards: [],
  cardsMap: new Map<string, DigimonCard>(),
  format: 'paper',
};

export const DigimonCardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  // cards / cardsMap stay complete for deck lookups; browsing uses poolCards
  withComputed(({ cards, format }) => ({
    poolCards: computed(() => poolFor(cards(), format())),
  })),

  withMethods((store) => {
    let requestedCardset: CARDSET | null = null;

    return {
      async updateCards(cardset: CARDSET): Promise<void> {
        requestedCardset = cardset;
        const cards = await setupDigimonCards(cardset);
        // A language switch while this one was loading wins
        if (requestedCardset !== cardset) return;
        const filteredCards = cards;
        const cardsMap = setupDigimonCardMap(cards);
        patchState(store, (state) => ({
          ...state,
          cards,
          filteredCards,
          cardsMap,
        }));
      },
      updateFormat(format: DeckFormat): void {
        patchState(store, { format });
      },
      updateFilteredCards(filteredCards: DigimonCard[]): void {
        patchState(store, (state) => ({ filteredCards }));
      },
    };
  }),
);
