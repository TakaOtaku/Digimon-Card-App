import {createReducer, on} from '@ngrx/store';
import * as DigimonActions from "../actions/digimon.actions";
import {initialState} from '../digimon.state';

export const digimonReducer = createReducer(
  initialState.digimonCards,
  on(DigimonActions.setDigimonCards, (state, { allCards }) => ({...state, allCards})),
  on(DigimonActions.setFilteredDigimonCards, (state, { filteredCards }) => ({...state,  filteredCards}))
);
