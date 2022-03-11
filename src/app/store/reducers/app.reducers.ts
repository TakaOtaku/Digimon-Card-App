import {createReducer, on} from '@ngrx/store';
import * as DigimonActions from "../actions/digimon.actions";
import {initialState} from '../digimon.state';

export const appReducer = createReducer(
  initialState
);
