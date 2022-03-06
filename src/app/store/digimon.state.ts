import {ICard, ISave} from "../models";

export const featureName = "digimonCards";

export interface IDigimonState {
  digimonCards: ReadonlyArray<ICard>;
  save: ISave;
}

export const initialState: IDigimonState = {
  digimonCards: [],
  save: {
    collection: [],
    decks: [],
    settings: {}
  }
}
