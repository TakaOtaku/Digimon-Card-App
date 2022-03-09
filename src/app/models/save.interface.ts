import {ISettings} from "./settings.interface";

export interface ISave {
  collection: ICollectionCard[];
  decks: IDeck[];
  settings: ISettings;
}

export interface ICollectionCard {
  id: string;
  count: number;
}

export interface IDeck {
  cards: IDeckCard[];
  title?: string;
  description?: string;
  color?: string;
  image?: string;
}

export interface IDeckCard {
  count: number;
  id: string;
}
