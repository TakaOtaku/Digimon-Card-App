import {ICard, IDeck, ISave} from "../models";

export interface IDigimonState {
  digimonCards: IDigimonCards;
  deck: IDeck | null;
  site: number;
  save: ISave;
}

export interface IDigimonCards {
  allCards: ICard[];
  filteredCards: ICard[];
}

export const initialState: IDigimonState = {
  digimonCards: {
    allCards: [],
    filteredCards: []
  },
  deck: null,
  site: 0,
  save: {
    collection: [],
    decks: [],
    settings: {
      filter: {
        searchFilter: '',
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
