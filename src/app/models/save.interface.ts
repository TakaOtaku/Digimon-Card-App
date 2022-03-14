import {ISettings} from "./settings.interface";

export interface ISave {
  collection: ICountCard[];
  decks: IDeck[];
  settings: ISettings;
}

export interface ICountCard {
  id: string;
  count: number;
}

export interface IDeck {
  cards: ICountCard[];
  sideDeck?: ICountCard[];
  title?: string;
  description?: string;
  color?: string;
  cardImage?: string;
  tags?: string[];
}
