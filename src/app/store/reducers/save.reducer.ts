import {createReducer, on} from '@ngrx/store';
import {ICountCard, IDeck, ISave} from "../../../models";
import {CARDSET} from "../../../models/card-set.enum";
import {
  addToCollection,
  changeCardCount,
  changeCardSets,
  changeCardSize,
  changeCollectionMinimum,
  changeCollectionMode,
  changeDeck,
  changeShowVersion,
  deleteDeck,
  importDeck,
  loadSave,
  setCollection,
  setSave
} from "../digimon.actions";

export const emptySettings = {
  cardSet: CARDSET.BothOverwrite,
  cardSize: 10,
  collectionMode: true,
  collectionMinimum: 1,
  showPreRelease: true,
  showStampedCards: true,
  showAACards: true
};

export const initialState: ISave = {
  collection: [],
  decks: [],
  settings: emptySettings
}

export const saveReducer = createReducer(
  initialState,

  //region Save Reducers
  on(setSave, (state, {save}) => save),
  on(loadSave, (state, {save}) => save),
  //endregion

  //region Collection Reducers
  on(setCollection, (state, {collection}) => ({...state, collection})),
  on(addToCollection, (state, {collectionCards}) => ({
    ...state,
    collection: [...new Set([...state.collection, ...collectionCards])]
  })),
  //endregion

  //region Settings Reducers
  on(changeCardSets, (state, {cardSet}) => ({...state, settings: {...state.settings, cardSet}})),
  on(changeCardSize, (state, {cardSize}) => ({...state, settings: {...state.settings, cardSize}})),
  on(changeCollectionMode, (state, {collectionMode}) => ({...state, settings: {...state.settings, collectionMode}})),
  on(changeCollectionMinimum, (state, {minimum}) => ({...state, settings: {...state.settings, collectionMinimum: minimum}})),
  on(changeShowVersion, (state, {showPre, showAA, showStamp}) =>
    ({...state, settings: {...state.settings, showPreRelease: showPre, showAACards: showAA, showStampedCards: showStamp}})),
  //endregion

  //region Card Count Reducers
  on(changeCardCount, (state, {id, count}) => {
    const taken = state.collection.find((card) => card.id === id);
    if (taken) {
      // Increase the Cards Count
      const collection = state.collection.map(card => {
        if (card.id !== id) {
          return card;
        }
        return {id, count} as ICountCard;
      });
      return {...state, collection};
    } else {
      // Create new Card and add it to the state
      const card = {id, count} as ICountCard;
      const collection = [...state.collection, card]
      return {...state, collection};
    }
  }),
  //endregion

  //region Deck Reducers
  on(importDeck, (state, {deck}) => {
    if (!state.decks) {
      return ({...state, decks: [deck]})
    }
    const foundDeck = state.decks?.find(value => value.id === deck.id);
    if (foundDeck) {
      const allButFoundDeck: IDeck[] = state.decks.filter(value => value.id !== deck.id);
      const decks: IDeck[] = [...new Set([...allButFoundDeck, deck])];
      return ({...state, decks})
    }
    return ({...state, decks: [...state.decks, deck]})
  }),
  on(changeDeck, (state, {deck}) => {
    const decks = state.decks.map(value => {
      if(value?.id === deck.id) {
        return deck;
      }
      return value;
    });
    return ({...state, decks: [...new Set(decks)]})
  }),
  on(deleteDeck, (state, {deck}) => ({...state, decks: [...new Set(state.decks.filter(item => item !== deck))]})),
  //endregion
);
