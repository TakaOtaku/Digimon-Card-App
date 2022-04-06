import {ICountCard} from "./count-card.interface";
import {IDeck} from "./deck.interface";
import {ISettings} from "./settings.interface";

export interface ISave {
  collection: ICountCard[];
  decks: IDeck[];
  settings: ISettings;
}




