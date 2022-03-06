import {ICollectionCard} from "./collection-card.interface";
import {IDeck} from "./deck.interface";
import {ISettings} from "./settings.interface";

export interface ISave {
  collection: ICollectionCard[];
  decks: IDeck[];
  settings: ISettings;
}
