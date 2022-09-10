import {createReducer, on} from '@ngrx/store';
import * as uuid from 'uuid';
import {IDigimonState} from '../../../models';
import {addCardToDeck, changeFilter, changeSort, setDeck, setMobileCollectionView} from '../digimon.actions';

export const emptyDeck = {
  id: uuid.v4(),
  cards: [],
  color: {name: 'White', img: 'assets/decks/white.svg'},
};

export const emptyFilter = {
  searchFilter: '',
  setFilter: [],
  cardCountFilter: [0, 5],
  levelFilter: [2, 7],
  playCostFilter: [0, 20],
  digivolutionFilter: [0, 7],
  dpFilter: [1, 16],
  rarityFilter: [],
  versionFilter: [],
  keywordFilter: [],
  formFilter: [],
  attributeFilter: [],
  typeFilter: [],
  colorFilter: [],
  cardTypeFilter: [],
  illustratorFilter: [],
  specialRequirementsFilter: [],
  blockFilter: [],
  restrictionsFilter: [],
  sourceFilter: [],
};

export const initialState: IDigimonState = {
  deck: emptyDeck,
  filter: emptyFilter,
  mobileCollectionView: false,
  addCardToDeck: '',
  sort: {
    sortBy: {
      name: 'ID',
      element: 'id',
    },
    ascOrder: true,
  },
};

export const digimonReducer = createReducer(
  initialState,
  on(changeFilter, (state, {filter}) => ({...state, filter})),
  on(changeSort, (state, {sort}) => ({...state, sort})),
  on(setDeck, (state, {deck}) => ({...state, deck})),
  on(setMobileCollectionView, (state, {mobileCollectionView}) => ({...state, mobileCollectionView})),
  on(addCardToDeck, (state, {addCardToDeck}) => ({...state, addCardToDeck}))
);
