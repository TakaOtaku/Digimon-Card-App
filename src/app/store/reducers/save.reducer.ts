import { createReducer, on } from '@ngrx/store';
import { ICountCard, IDeck, ISave, ISettings } from '../../../models';
import { CARDSET } from '../../../models/enums/card-set.enum';
import {
  addToCollection,
  changeCardCount,
  changeCardSets,
  changeCollectionMinimum,
  changeCollectionMode,
  changeShowUserStats,
  changeShowVersion,
  deleteDeck,
  importDeck,
  loadSave,
  saveDeck,
  setCollection,
  setSave,
} from '../digimon.actions';

export const emptySettings: ISettings = {
  cardSet: CARDSET.Both,
  collectionMode: false,
  collectionMinimum: 1,

  showPreRelease: true,
  showStampedCards: true,
  showAACards: true,

  sortDeckOrder: 'Level',

  showUserStats: true,
};

export const emptySave: ISave = {
  uid: '',
  photoURL: '',
  displayName: '',
  version: 2.0,
  collection: [],
  decks: [],
  settings: emptySettings,
};

export const saveReducer = createReducer(
  emptySave,

  on(setSave, (state, { save }) => save),
  on(loadSave, (state, { save }) => save),

  on(setCollection, (state, { collection }) => ({ ...state, collection })),
  on(addToCollection, (state, { collectionCards }) => ({
    ...state,
    collection: [...new Set([...state.collection, ...collectionCards])],
  })),
  on(changeCardCount, (state, { id, count }) => {
    const taken = state.collection.find((card) => card.id === id);
    if (taken) {
      // Increase the Cards Count
      const collection = state.collection.map((card) => {
        if (card.id !== id) {
          return card;
        }
        return { id, count } as ICountCard;
      });
      return { ...state, collection };
    } else {
      // Create new Card and add it to the state
      const card = { id, count } as ICountCard;
      const collection = [...state.collection, card];
      return { ...state, collection };
    }
  }),

  on(changeCardSets, (state, { cardSet }) => ({
    ...state,
    settings: { ...state.settings, cardSet },
  })),
  on(changeCollectionMode, (state, { collectionMode }) => ({
    ...state,
    settings: { ...state.settings, collectionMode },
  })),
  on(changeShowUserStats, (state, { showUserStats }) => ({
    ...state,
    settings: { ...state.settings, showUserStats },
  })),
  on(changeCollectionMinimum, (state, { minimum }) => ({
    ...state,
    settings: { ...state.settings, collectionMinimum: minimum },
  })),
  on(changeShowVersion, (state, { showPre, showAA, showStamp }) => ({
    ...state,
    settings: {
      ...state.settings,
      showPreRelease: showPre,
      showAACards: showAA,
      showStampedCards: showStamp,
    },
  })),

  on(importDeck, (state, { deck }) => {
    if (!state.decks) {
      return { ...state, decks: [deck] };
    }
    const foundDeck = state.decks?.find((value) => value.id === deck.id);
    if (foundDeck) {
      const allButFoundDeck: IDeck[] = state.decks.filter(
        (value) => value.id !== deck.id
      );
      const decks: IDeck[] = [...new Set([...allButFoundDeck, deck])];
      return { ...state, decks };
    }
    return { ...state, decks: [...state.decks, deck] };
  }),
  on(saveDeck, (state, { deck }) => {
    const decks = state.decks.map((value) => {
      if (value?.id === deck.id) {
        return deck;
      }
      return value;
    });
    return { ...state, decks: [...new Set(decks)] };
  }),
  on(deleteDeck, (state, { deck }) => {
    const decks = [
      ...new Set(state.decks.filter((item) => item.id !== deck.id)),
    ];
    return {
      ...state,
      decks,
    };
  })
);
