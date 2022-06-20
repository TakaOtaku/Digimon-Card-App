import { createReducer, on } from '@ngrx/store';
import { IDigimonCards } from '../../../models';
import { setupAllDigimonCards } from '../../functions/digimon-card.functions';
import { setDigimonCards, setFilteredDigimonCards } from '../digimon.actions';

export const initialState: IDigimonCards = {
  allCards: setupAllDigimonCards(),
  filteredCards: setupAllDigimonCards(),
};

export const digimonCardReducer = createReducer(
  initialState,
  on(setDigimonCards, (state, { digimonCards }) => ({
    ...state,
    allCards: digimonCards,
  })),
  on(setFilteredDigimonCards, (state, { filteredCards }) => ({
    ...state,
    filteredCards,
  }))
);
