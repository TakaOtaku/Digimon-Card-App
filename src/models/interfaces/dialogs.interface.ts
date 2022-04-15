import {ICard} from "./card.interface";
import {IDeck} from "./deck.interface";

export interface IDialogs {
  exportDeck: IExportDeck;
  importDeck: IImportDeck;
  accessoryDeck: IAccessoryDeck;
  viewCard: IViewCard;
}

export interface IExportDeck {
  show: boolean;
  deck: IDeck;
}

export interface IImportDeck {
  show: boolean;
}

export interface IAccessoryDeck {
  show: boolean;
  deck: IDeck;
}

export interface IViewCard {
  show: boolean;
  card: ICard;
}



