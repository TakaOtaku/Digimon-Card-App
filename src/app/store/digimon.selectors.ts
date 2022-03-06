import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ICard, ISave} from "../models";

export const selectDigimonCards = createFeatureSelector<ReadonlyArray<ICard>>('digimonCards');

export const selectSave = createFeatureSelector<ISave>('save');

export const selectCollection = createSelector(
  selectSave,
  (state: ISave) => state.collection
);
