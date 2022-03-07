import {createAction, props} from '@ngrx/store';
import {ICard} from "../../models";

export const setDigimonCards = createAction(
  '[Digimon Card List] Set Digimon Card List',
  props<{ digimonCards: ICard[] }>()
);
export const setFilteredDigimonCards = createAction(
  '[Digimon Card List] Set Filtered Digimon Card List',
  props<{ filteredDigimonCards: ICard[] }>()
);
