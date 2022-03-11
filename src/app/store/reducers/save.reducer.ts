import {createReducer, on} from '@ngrx/store';
import {ICollectionCard, ISave} from "../../models";
import {
  changeCardCount,
  changeCardSize,
  changeCollectionMode,
  decreaseCardCount,
  deleteDeck,
  importDeck,
  increaseCardCount,
  loadSave,
  setSave
} from "../digimon.actions";

export const initialState: ISave = {
  collection: [],
  decks: [],
  settings: {
    cardSize: 40,
    collectionMode: false,
  }
}

export const saveReducer = createReducer(
  initialState,

  on(changeCardSize, (state, {cardSize}) => ({...state, settings: {...state.settings, cardSize}})),
  on(changeCollectionMode, (state, {collectionMode}) => ({...state, settings: {...state.settings, collectionMode}})),

  //region Card Count Reducers
  on(changeCardCount, (state, { id, count }) => {
    const taken = state.collection.find((card) => card.id === id);
    if (taken) {
      // Increase the Cards Count
      const collection = state.collection.map(card => {
        if (card.id !== id) {
          return card;
        }
        return {id, count} as ICollectionCard;
      });
      return {...state, collection};
    } else {
      // Create new Card and add it to the state
      const card = {id, count} as ICollectionCard;
      const collection = [...state.collection, card]
      return {...state, collection};
    }
  }),
  on(increaseCardCount, (state, { id }) => {
    const taken = state.collection.find((card) => card.id === id);
    if (taken) {
      // Increase the Cards Count
      const collection = state.collection.map(card => {
        if (card.id !== id) {
          return card;
        }
        const count = card.count + 1;
        return {id, count} as ICollectionCard;
      });
      return {...state, collection};
    } else {
      // Create new Card and add it to the state
      const card = {id, count: 1} as ICollectionCard;
      const collection = [...state.collection, card]
      return {...state, collection};
    }
  }),
  on(decreaseCardCount, (state, { id }) => {
    const taken = state.collection.find((card) => card.id === id);
    if (taken && taken.count > 0) {
      // Increase the Cards Count
      const collection = state.collection.map(card => {
        if (card.id !== id) {
          return card;
        }
        const count = card.count - 1;
        return {id, count} as ICollectionCard;
      });
      return {...state, collection};
    }
    return state;
  }),
  //endregion

  //region Save Reducers
  on(setSave, (state, {save}) => save),
  on(loadSave, (state, {save}) => save),
  //endregion

  //region Deck Reducers
  on(importDeck, (state, {deck}) => ({...state, decks: [...state.decks, deck]})),
  on(deleteDeck, (state, {deck}) => ({...state, decks: [...new Set(state.decks.filter(item => item !== deck))]})),
  //endregion
);
