import {ICountCard} from './count-card.interface';
import {IDeck} from './deck.interface';
import {ISettings} from './settings.interface';

export interface ISave {
  uid?: string;
  displayName?: string;
  photoURL?: string;
  version?: number;
  collection: ICountCard[];
  decks: IDeck[];
  settings: ISettings;
}
