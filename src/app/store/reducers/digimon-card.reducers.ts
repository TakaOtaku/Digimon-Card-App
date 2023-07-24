import { DigimonActions } from './../digimon.actions';
import { createReducer, on } from '@ngrx/store';
import { IDigimonCards } from '../../../models';
import { setupAllDigimonCards } from '../../functions/digimon-card.functions';

export const initialState: IDigimonCards = {
  allCards: setupAllDigimonCards(),
  filteredCards: setupAllDigimonCards(),
};

export const digimonCardReducer = createReducer(
  initialState,
  on(DigimonActions.setdigimoncards, (state, { digimonCards }) => ({
    ...state,
    allCards: digimonCards,
  })),
  on(DigimonActions.setfiltereddigimoncards, (state, { filteredCards }) => ({
    ...state,
    filteredCards,
  }))
);
