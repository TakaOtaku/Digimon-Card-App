import {createReducer, on} from '@ngrx/store';
import {IDigimonState} from "../../models";
import {changeCardSize, changeCollectionMode, changeFilter, changeSort, setDeck, setSite} from '../digimon.actions';

export const initialState: IDigimonState = {
  deck: null,
  site: 0,
  cardSize: 8,
  collectionMode: true,
  filter: {
    searchFilter: '',
    cardCountFilter: null,
    setFilter: [],
    colorFilter: [],
    cardTypeFilter: [],
    typeFilter: [],
    lvFilter: [],
    rarityFilter: [],
    versionFilter: []
  },
  sort: {
    sortBy: {
      name: 'id',
      element: 'id'
    },
    ascOrder: true
  }
}


export const digimonReducer = createReducer(
  initialState,
  on(changeFilter, (state, {filter}) => ({...state,  filter})),
  on(changeSort, (state, {sort}) => ({...state, sort})),
  on(changeCardSize, (state, {cardSize}) => ({...state, cardSize})),
  on(changeCollectionMode, (state, {collectionMode}) => ({...state, collectionMode})),
  on(setSite, (state, {site}) => ({...state, site})),
  on(setDeck, (state, {deck}) => ({...state, deck})),
);
