import {createReducer, on} from '@ngrx/store';
import {IDigimonState} from "../../models";
import {changeFilter, changeSort, setDeck, setSite} from '../digimon.actions';

export const initialState: IDigimonState = {
  deck: null,
  site: 0,
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
  on(setSite, (state, {site}) => ({...state, site})),
  on(setDeck, (state, {deck}) => ({...state, deck})),
);
