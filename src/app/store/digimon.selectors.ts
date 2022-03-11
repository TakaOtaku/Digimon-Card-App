import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ICard, ICollectionCard, IDigimonCards, IDigimonState, IFilter, ISave, ISort} from "../models";

export const selectIDigimonCards = createFeatureSelector<IDigimonCards>('digimonCards');
export const selectSave = createFeatureSelector<ISave>('save');
export const selectDigimonState = createFeatureSelector<IDigimonState>('digimon');

//region Digimon Selectors
export const selectSite = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.site
);
export const selectFilter = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.filter
);
export const selectSort = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.sort
);
export const selectCardSize = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.cardSize
);
export const selectCollectionMode = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.collectionMode
);
export const selectDeck = createSelector(
  selectDigimonState,
  (state: IDigimonState) => state.deck
);
//endregion

//region Digimon Card Selectors
export const selectAllCards = createSelector(
  selectIDigimonCards,
  (state: IDigimonCards) => state.allCards
);

export const selectFilteredCards = createSelector(
  selectIDigimonCards,
  (state: IDigimonCards) => state.filteredCards
);
//endregion

//region Save Selectors
export const selectCollection = createSelector(
  selectSave,
  (state: ISave) => state.collection
);

export const selectDecks = createSelector(
  selectSave,
  (state: ISave) => state.decks
);

export const selectSettings = createSelector(
  selectSave,
  (state: ISave) => state.settings
);
//endregion

export const selectCardListViewModel = createSelector(
  selectFilteredCards,
  selectCollection,
  selectCardSize,
  selectCollectionMode,
  ( cards: ICard[], collection: ICollectionCard[], cardSize: number, collectionMode: boolean) =>
    ({cards, collection, cardSize, collectionMode})
);

export const selectNavBarViewModel = createSelector(
  selectSave,
  selectSort,
  selectCardSize,
  selectCollectionMode,
  (save: ISave, sort: ISort, cardSize: number, collectionMode: boolean) => ({save, sort, cardSize, collectionMode})
);


export const selectChangeFilterEffect = createSelector(
  selectAllCards,
  selectCollection,
  selectFilter,
  selectSort,
  ( cards: ICard[], collection: ICollectionCard[], filter: IFilter, sort: ISort) => ({cards, collection, filter, sort})
);

