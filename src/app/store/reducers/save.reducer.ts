import {createReducer, on} from '@ngrx/store';
import {ICollectionCard} from "../../models";
import * as CollectionActions from "../actions/collection.actions";
import * as SaveActions from "../actions/save.actions";
import {initialState} from '../digimon.state';

export const saveReducer = createReducer(
  initialState.save,
  on(CollectionActions.changeCardCount, (state, { id, count }) => {
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
  on(CollectionActions.increaseCardCount, (state, { id }) => {
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
  on(CollectionActions.decreaseCardCount, (state, { id }) => {
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
  on(SaveActions.setSave, (state, {save}) => save),
  on(SaveActions.loadSave, (state, {save}) => save),
  on(SaveActions.changeFilter, (state, {filter}) => ({...state,  settings: {...state.settings, filter}})),
  on(SaveActions.changeSort, (state, {sort}) => ({...state, settings: {...state.settings, sort}})),
  on(SaveActions.changeCardSize, (state, {cardSize}) => {
    if(cardSize === undefined) {return state;}
    return ({...state, settings: {...state.settings, cardSize}})
  }),
  on(SaveActions.changeCollectionMode, (state, {collectionMode}) => {
    if(collectionMode === undefined) {return state;}
    return ({...state, settings: {...state.settings, collectionMode}})
  }),
);
