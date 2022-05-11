import {createReducer, on} from '@ngrx/store';
import * as uuid from "uuid";
import {englishCards} from "../../../assets/cardlists/eng/english";
import {IDeck, IDigimonState} from "../../../models";
import {
  addToDeck,
  changeFilter,
  changeSort,
  setAccessoryDeckDialog,
  setDeck,
  setExportDeckDialog,
  setImportDeckDialog,
  setSite,
  setViewCardDialog
} from '../digimon.actions';

export const emptyDeck = {
  id: uuid.v4(),
  cards: [],
  color: {name: 'White', img: 'assets/decks/white.svg'},
};

export const fullDeck: IDeck = {
  id: uuid.v4(),
  cards: [
    {id: 'ST5-01', count: 1},
    {id: 'BT6-005', count: 4},
    {id: 'BT2-052', count: 3},
    {id: 'BT3-061', count: 2},
    {id: 'BT2-056', count: 3},
    {id: 'BT5-062', count: 3},
    {id: 'BT6-058', count: 3},
    {id: 'BT7-061', count: 3},
    {id: 'BT3-070', count: 4},
    {id: 'EX1-052', count: 4},
    {id: 'BT3-074', count: 4},
    {id: 'EX1-053', count: 4},
    {id: 'BT5-087', count: 2},
    {id: 'EX1-066', count: 1},
    {id: 'BT4-096', count: 2},
    {id: 'BT6-090', count: 1},
    {id: 'BT3-095', count: 2},
    {id: 'BT2-089', count: 1},
    {id: 'BT6-106', count: 2},
    {id: 'BT7-105', count: 2},
    {id: 'BT5-105', count: 2},
    {id: 'EX1-071', count: 2}
  ],
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
}

export const initialState: IDigimonState = {
  deck: emptyDeck,
  site: 0,
  dialogs: {
    exportDeck: {show: false, deck: emptyDeck},
    importDeck: {show: false},
    accessoryDeck: {show: false, deck: emptyDeck},
    viewCard: {show: false, card: englishCards[0]}
  },
  filter: emptyFilter,
  sort: {
    sortBy: {
      name: 'ID',
      element: 'id'
    },
    ascOrder: true
  }
}


export const digimonReducer = createReducer(
  initialState,
  on(changeFilter, (state, {filter}) => ({...state, filter})),
  on(changeSort, (state, {sort}) => ({...state, sort})),
  on(setSite, (state, {site}) => ({...state, site})),
  on(setDeck, (state, {deck}) => ({...state, deck})),
  on(addToDeck, (state, {card}) => {
    if (state.deck) {
      const foundCard = state.deck.cards.find(deckCard => deckCard.id === card.id);
      if (foundCard) {
        //Increase Card Count
        const cards = state.deck.cards.filter(deckCard => deckCard.id !== card.id);
        cards.push({id: foundCard.id, count: foundCard.count + 1})
        return {...state, deck: {...state.deck, cards}};
      } else {
        //Add Card
        const cards = [...state?.deck?.cards, card];
        return {...state, deck: {...state.deck, cards}};
      }
    } else {
      return {...state};
    }
  }),
  on(setExportDeckDialog, (state, {show, deck}) => ({...state, dialogs: {...state.dialogs, exportDeck: {show, deck}}})),
  on(setImportDeckDialog, (state, {show}) => ({...state, dialogs: {...state.dialogs, importDeck: {show}}})),
  on(setAccessoryDeckDialog, (state, {show, deck}) => ({...state, dialogs: {...state.dialogs, accessoryDeck: {show, deck}}})),
  on(setViewCardDialog, (state, {show, card}) => ({...state, dialogs: {...state.dialogs, viewCard: {show, card}}})),
);
