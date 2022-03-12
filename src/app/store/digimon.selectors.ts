import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ICard, ICollectionCard, IDigimonCards, IDigimonState, IFilter, ISave, ISettings, ISort} from "../models";

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

export const selectCardSize = createSelector(
  selectSettings,
  (state: ISettings) => state.cardSize
);
export const selectCollectionMode = createSelector(
  selectSettings,
  (state: ISettings) => state.collectionMode
);
//endregion

export const selectCardListViewModel = createSelector(
  selectFilteredCards,
  selectCollection,
  selectCollectionMode,
  (cards: ICard[], collection: ICollectionCard[], collectionMode: boolean) =>
    ({cards, collection, collectionMode})
);

export const selectNavBarViewModel = createSelector(
  selectCardSize,
  selectCollectionMode,
  (cardSize: number, collectionMode: boolean) => ({cardSize, collectionMode})
);

export const selectFilterBoxViewModel = createSelector(
  selectFilter,
  selectSort,
  (filter: IFilter, sort: ISort) => ({filter, sort})
);


export const selectChangeFilterEffect = createSelector(
  selectAllCards,
  selectCollection,
  selectFilter,
  selectSort,
  ( cards: ICard[], collection: ICollectionCard[], filter: IFilter, sort: ISort) => ({cards, collection, filter, sort})
);

