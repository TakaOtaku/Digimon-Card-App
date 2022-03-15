import {IDeck} from "./deck.interface";
import {IFilter} from "./filter.interface";
import {ISort} from "./sort.interface";

export interface IDigimonState {
  deck: IDeck,
  site: number,
  filter: IFilter;
  sort : ISort;
}



