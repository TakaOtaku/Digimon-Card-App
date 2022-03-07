import {ICard, ISave} from "../models";

export const featureName = "digimonCards";

export interface IDigimonCards {
  digimonCards: ICard[];
  filteredDigimonCards: ICard[];
}

export interface IDigimonState {
  digimonCards: IDigimonCards;
  save: ISave;
}

export const initialState: IDigimonState = {
  digimonCards: {
    digimonCards: [],
    filteredDigimonCards: []
  },
  save: {
    collection: [],
    decks: [],
    settings: {
      filter: {
        cardCountFilter: null,
        setFilter: [],
        colorFilter: [],
        cardTypeFilter: [],
        typeFilter: [],
        lvFilter: [],
        rarityFilter: [],
        versionFilter: []
      },
      sort: {
        sortBy: {
          name: 'id',
          element: 'id'
        },
        ascOrder: true
      },
      cardSize: 8,
      collectionMode: true
    }
  }
}
