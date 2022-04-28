import {IDeck} from "./deck.interface";
import {IDialogs} from "./dialogs.interface";
import {IFilter} from "./filter.interface";
import {ISort} from "./sort.interface";

export interface IDigimonState {
  deck: IDeck;
  site: number;
  dialogs: IDialogs;
  filter: IFilter;
  sort : ISort;
}



