import { IDeck } from './deck.interface';

export interface IUserAndDecks {
  user: IUserWithName;
  decks: IDeck[];
}

export interface IUserWithName {
  uid: string;
  name: string;
}
