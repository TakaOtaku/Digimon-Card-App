import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ISave} from "../models";
import {IDigimonCards} from "./digimon.state";

export const selectIDigimonCards = createFeatureSelector<IDigimonCards>('digimonCards');

export const selectSave = createFeatureSelector<ISave>('save');

export const selectDigimonCards = createSelector(
  selectIDigimonCards,
  (state: IDigimonCards) => state.digimonCards
);

export const selectFilteredDigimonCards = createSelector(
  selectIDigimonCards,
  (state: IDigimonCards) => state.filteredDigimonCards
);

export const selectCollection = createSelector(
  selectSave,
  (state: ISave) => state.collection
);

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

export const selectDecks = createSelector(
  selectSave,
  (state: ISave) => state.decks
);
