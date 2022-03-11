import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ICard, ICollectionCard, IDeck, IFilter, ISave, ISort} from "../models";
import {IDigimonCards} from "./digimon.state";

export const selectIDigimonCards = createFeatureSelector<IDigimonCards>('digimonCards');
export const selectSave = createFeatureSelector<ISave>('save');
export const selectSite = createFeatureSelector<number>('site');
export const selectDeck = createFeatureSelector<IDeck>('deck');

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
//endregion

//region Settings Selectors
export const selectSettings = createSelector(
  selectSave,
  (state: ISave) => state.settings
);

export const selectFilter = createSelector(
  selectSave,
  (state: ISave) => state.settings.filter
);

export const selectSort = createSelector(
  selectSave,
  (state: ISave) => state.settings.sort
);

export const selectCardSize = createSelector(
  selectSave,
  (state: ISave) => state.settings.cardSize
);

export const selectCollectionMode = createSelector(
  selectSave,
  (state: ISave) => state.settings.collectionMode
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
  (save: ISave) => ({save})
);


export const selectChangeFilterEffect = createSelector(
  selectAllCards,
  selectCollection,
  selectFilter,
  selectSort,
  ( cards: ICard[], collection: ICollectionCard[], filter: IFilter, sort: ISort) => ({cards, collection, filter, sort})
);

