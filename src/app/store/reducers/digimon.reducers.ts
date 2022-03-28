import {createReducer, on} from '@ngrx/store';
import * as uuid from "uuid";
import {IDigimonState} from "../../../models";
import {addToDeck, changeFilter, changeSort, setDeck, setSite} from '../digimon.actions';

export const initialState: IDigimonState = {
  deck: {
    id: uuid.v4(),
    cards: [],
    color: {name:'White', img: 'assets/decks/white.svg'},
  },
  site: 1,
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
);
