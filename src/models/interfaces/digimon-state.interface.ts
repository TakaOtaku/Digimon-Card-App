import {IDeck} from "./deck.interface";
import {IFilter} from "./filter.interface";
import {ISort} from "./sort.interface";

export interface IDigimonState {
  deck: IDeck,
  mobile: boolean;
  site: number,
  filter: IFilter;
  sort : ISort;
}



