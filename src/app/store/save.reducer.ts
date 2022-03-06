import {createReducer, on} from '@ngrx/store';
import {ICollectionCard} from "../models";
import * as DigimonActions from "./digimon.actions";
import {initialState} from './digimon.state';

export const saveReducer = createReducer(
  initialState.save,
  on(DigimonActions.setSave, (state, {save}) => save),
  on(DigimonActions.increaseCardCount, (state, { id }) => {
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
  on(DigimonActions.decreaseCardCount, (state, { id }) => {
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
  })
);
