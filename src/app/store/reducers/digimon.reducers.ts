import {createReducer, on} from '@ngrx/store';
import {IDeck, IDigimonState} from "../../models";
import {changeFilter, changeSort, setDeck, setSite} from '../digimon.actions';

const testDeck: IDeck = {
  cards: [
    {
      "count": 3,
      "id": "BT2-072"
    },
    {
      "count": 1,
      "id": "BT2-083"
    },
    {
      "count": 1,
      "id": "BT2-090"
    },
    {
      "count": 4,
      "id": "BT2-110"
    },
    {
      "count": 2,
      "id": "BT2-111"
    },
    {
      "count": 4,
      "id": "BT3-006"
    },
    {
      "count": 1,
      "id": "BT3-075"
    },
    {
      "count": 2,
      "id": "BT3-077"
    },
    {
      "count": 1,
      "id": "BT3-096"
    },
    {
      "count": 2,
      "id": "BT4-079"
    },
    {
      "count": 2,
      "id": "BT5-062"
    },
    {
      "count": 2,
      "id": "BT5-087"
    },
    {
      "count": 1,
      "id": "BT6-006"
    },
    {
      "count": 3,
      "id": "BT6-060"
    },
    {
      "count": 4,
      "id": "BT6-065"
    },
    {
      "count": 4,
      "id": "BT6-068"
    },
    {
      "count": 4,
      "id": "BT6-077"
    },
    {
      "count": 2,
      "id": "BT6-090"
    },
    {
      "count": 1,
      "id": "BT6-095"
    },
    {
      "count": 2,
      "id": "BT6-105"
    },
    {
      "count": 3,
      "id": "BT6-109"
    },
    {
      "count": 4,
      "id": "BT6-112"
    },
    {
      "count": 2,
      "id": "BT7-015"
    }
  ]
}

export const initialState: IDigimonState = {
  deck: testDeck,
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
