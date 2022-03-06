import {createAction, props} from '@ngrx/store';
import {ICard, ISave} from "../models";

export const setDigimonCards = createAction(
  '[Digimon Card List] Set Digimon Card List',
  props<{ digimonCards: ReadonlyArray<ICard> }>()
);

export const setSave = createAction(
  '[Digimon Card Save] Set Digimon Card Save',
  props<{ save: ISave }>()
);

export const increaseCardCount = createAction(
  '[Digimon Cards] Increase Digimon Card Count',
  props<{ id: string }>()
);

export const decreaseCardCount = createAction(
  '[Digimon Cards] Decreased Digimon Card Count',
  props<{ id: string }>()
);
