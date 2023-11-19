import { createReducer, on } from '@ngrx/store';
import {
  setupDigimonCardMap,
  setupDigimonCards,
} from '../../../assets/cardlists/DigimonCards';
import { CARDSET, IDigimonCards } from '../../../models';
import { DigimonActions } from '../digimon.actions';

export const initialState: IDigimonCards = {
  allCards: setupDigimonCards(CARDSET.English),
  digimonCardMap: setupDigimonCardMap(CARDSET.English),
  filteredCards: setupDigimonCards(CARDSET.English),
};

export const digimonCardReducer = createReducer(
  initialState,
  on(DigimonActions.setDigimonCards, (state, { digimonCards }) => ({
    ...state,
    allCards: digimonCards,
  })),
  on(DigimonActions.setDigimonCardMap, (state, { digimonCardMap }) => ({
    ...state,
    digimonCardMap: digimonCardMap,
  })),
  on(DigimonActions.setFilteredDigimonCards, (state, { filteredCards }) => ({
    ...state,
    filteredCards,
  }))
);
