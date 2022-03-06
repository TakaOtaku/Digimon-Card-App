import {createReducer, on} from '@ngrx/store';
import * as DigimonActions from "./digimon.actions";
import {initialState} from './digimon.state';

export const digimonReducer = createReducer(
  initialState.digimonCards,
  on(DigimonActions.setDigimonCards, (state, { digimonCards }) => digimonCards),
);
