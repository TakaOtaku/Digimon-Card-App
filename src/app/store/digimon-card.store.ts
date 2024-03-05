import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  setupDigimonCardMap,
  setupDigimonCards,
} from '../../assets/cardlists/DigimonCards';
import { CARDSET, DigimonCard } from '../../models';

type DigimonCards = {
  cards: DigimonCard[];
  filteredCards: DigimonCard[];
  cardsMap: Map<string, DigimonCard>;
};

const initialState: DigimonCards = {
  cards: [],
  filteredCards: [],
  cardsMap: new Map<string, DigimonCard>(),
};

export const DigimonCardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => ({
    updateCards(cardset: CARDSET): void {
      const cards = setupDigimonCards(cardset);
      const filteredCards = cards;
      const cardsMap = setupDigimonCardMap(cards);
      patchState(store, (state) => ({
        ...state,
        cards,
        filteredCards,
        cardsMap,
      }));
    },
    updateFilteredCards(filteredCards: DigimonCard[]): void {
      patchState(store, (state) => ({ filteredCards }));
    },
  })),
);
