import {createReducer, on} from '@ngrx/store';
import {setupDigimonCards} from "../../functions/digimon-card.functions";
import {IDigimonCards} from "../../models/digimon.cards.interface";
import {setDigimonCards, setFilteredDigimonCards} from '../digimon.actions';

export const initialState: IDigimonCards = {
  allCards: setupDigimonCards(),
  filteredCards: setupDigimonCards()
}


export const digimonCardReducer = createReducer(
  initialState,
  on(setDigimonCards, (state, { allCards }) => ({...state, allCards})),
  on(setFilteredDigimonCards, (state, { filteredCards }) => ({...state,  filteredCards}))
);
