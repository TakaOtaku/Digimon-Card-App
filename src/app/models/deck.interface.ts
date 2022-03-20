import {ICountCard} from "./count-card.interface";

export interface IDeck {
  id: string;
  cards: ICountCard[];
  sideDeck?: ICountCard[];
  title?: string;
  description?: string;
  color?: string;
  cardImage?: string;
  tags?: string[];
}
