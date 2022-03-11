import {createAction, props} from '@ngrx/store';
import {ICard, IDeck} from "../../models";

export const setDigimonCards = createAction(
  '[Digimon Card List] Set Digimon Card List',
  props<{ allCards: ICard[] }>()
);
export const setFilteredDigimonCards = createAction(
  '[Digimon Card List] Set Filtered Digimon Card List',
  props<{ filteredCards: ICard[] }>()
);

export const setDeck = createAction(
  '[Set Deck] Set current Deck',
  props<{ deck: IDeck }>()
);

export const setSite = createAction(
  '[Set Site] Set current Site',
  props<{ site: number }>()
);
