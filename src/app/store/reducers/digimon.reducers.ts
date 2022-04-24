import {createReducer, on} from '@ngrx/store';
import * as uuid from "uuid";
import englishJSON from "../../../assets/cardlists/english.json";
import {IDigimonState} from "../../../models";
import {
  addToDeck,
  changeFilter,
  changeSort,
  setAccessoryDeckDialog,
  setDeck,
  setEdit,
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

export const emptyFilter = {
  searchFilter: '',
  setFilter: [],
  cardCountFilter: [0, 5],
  levelFilter: [2, 7],
  playCostFilter: [0, 15],
  digivolutionFilter: [0, 6],
  dpFilter: [1, 15],
  rarityFilter: [],
  versionFilter: [],
  keywordFilter: [],
  formFilter: [],
  attributeFilter: [],
  typeFilter: [],
  colorFilter: [],
  cardTypeFilter: [],
}

export const initialState: IDigimonState = {
  deck: emptyDeck,
  edit: true,
  site: 0,
  dialogs: {
    exportDeck: {show: false, deck: emptyDeck},
    importDeck: {show: false},
    accessoryDeck: {show: false, deck: emptyDeck},
    viewCard: {show: false, card: englishJSON[0]}
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
  on(setEdit, (state, {edit}) => ({...state, edit})),
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
