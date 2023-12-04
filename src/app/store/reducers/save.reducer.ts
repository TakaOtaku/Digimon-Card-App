import { createReducer, on } from '@ngrx/store';
import { ICountCard, IDeck, ISave, ISettings } from '../../../models';
import { CARDSET } from '../../../models/enums/card-set.enum';
import {
  CollectionActions,
  DeckActions,
  SaveActions,
  WebsiteActions,
} from '../digimon.actions';

export const emptySettings: ISettings = {
  cardSet: CARDSET.English,
  collectionMode: false,
  collectionMinimum: 1,
  aaCollectionMinimum: 1,

  showPreRelease: true,
  showStampedCards: true,
  showAACards: true,
  showReprintCards: false,

  sortDeckOrder: 'Level',

  showUserStats: true,

  deckDisplayTable: false,
  displaySideDeck: true,
};

export const emptySave: ISave = {
  uid: '',
  photoURL: '',
  displayName: '',
  version: 4.0,
  collection: [],
  decks: [],
  settings: emptySettings,
};

export const saveReducer = createReducer(
  emptySave,

  on(SaveActions.setSave, (state, { save }) => save),
  on(SaveActions.getSave, (state, { save }) => save),

  on(SaveActions.setCollection, (state, { collection }) => ({
    ...state,
    collection,
  })),
  on(CollectionActions.addCard, (state, { collectionCards }) => ({
    ...state,
    collection: [...new Set([...state.collection, ...collectionCards])],
  })),
  on(CollectionActions.setCardCount, (state, { id, count }) => {
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

  on(SaveActions.setCardSets, (state, { cardSet }) => ({
    ...state,
    settings: { ...state.settings, cardSet },
  })),
  on(SaveActions.setCollectionMode, (state, { collectionMode }) => ({
    ...state,
    settings: { ...state.settings, collectionMode },
  })),
  on(SaveActions.setShowUserStats, (state, { showUserStats }) => ({
    ...state,
    settings: { ...state.settings, showUserStats },
  })),
  on(WebsiteActions.setCollectionMinimum, (state, { minimum }) => ({
    ...state,
    settings: { ...state.settings, collectionMinimum: minimum },
  })),
  on(WebsiteActions.setAACollectionMinimum, (state, { minimum }) => ({
    ...state,
    settings: { ...state.settings, aaCollectionMinimum: minimum },
  })),
  on(
    WebsiteActions.setShowVersion,
    (state, { showPre, showAA, showStamp }) => ({
      ...state,
      settings: {
        ...state.settings,
        showPreRelease: showPre,
        showAACards: showAA,
        showStampedCards: showStamp,
      },
    }),
  ),
  on(SaveActions.setDeckDisplayTable, (state, { deckDisplayTable }) => ({
    ...state,
    settings: { ...state.settings, deckDisplayTable },
  })),
  on(SaveActions.setShowReprintCards, (state, { showReprintCards }) => ({
    ...state,
    settings: { ...state.settings, showReprintCards },
  })),

  on(DeckActions.import, (state, { deck }) => {
    if (!state.decks) {
      return { ...state, decks: [deck] };
    }
    const foundDeck = state.decks?.find((value) => value.id === deck.id);
    if (foundDeck) {
      const allButFoundDeck: IDeck[] = state.decks.filter(
        (value) => value.id !== deck.id,
      );
      const decks: IDeck[] = [...new Set([...allButFoundDeck, deck])];
      return { ...state, decks };
    }
    return { ...state, decks: [...state.decks, deck] };
  }),
  on(DeckActions.save, (state, { deck }) => {
    const decks = state.decks.map((value) => {
      if (value?.id === deck.id) {
        return deck;
      }
      return value;
    });
    return { ...state, decks: [...new Set(decks)] };
  }),
  on(DeckActions.delete, (state, { deck }) => {
    const decks = [
      ...new Set(state.decks.filter((item) => item.id !== deck.id)),
    ];
    return {
      ...state,
      decks,
    };
  }),
);
