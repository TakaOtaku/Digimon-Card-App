import {createReducer, on} from '@ngrx/store';
import {setupDigimonCards} from "../../functions/digimon-card.functions";
import {IDigimonCards} from "../../../models";
import {setFilteredDigimonCards} from '../digimon.actions';

export const initialState: IDigimonCards = {
  allCards: setupDigimonCards(),
  filteredCards: setupDigimonCards()
}


export const digimonCardReducer = createReducer(
  initialState,
  on(setFilteredDigimonCards, (state, {filteredCards}) => ({...state, filteredCards}))
);
