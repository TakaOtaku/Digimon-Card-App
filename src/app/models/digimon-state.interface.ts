import {IDeck} from "./save.interface";

export interface IDigimonState {
  deck: IDeck | null,
  site: number,
  filter: IFilter;
  sort : ISort;
  cardSize: number;
  collectionMode: boolean;
}

export interface IFilter {
  searchFilter: string;
  cardCountFilter: number|null;
  setFilter: [];
  colorFilter: [];
  cardTypeFilter: [];
  typeFilter: [];
  lvFilter: [];
  rarityFilter: [];
  versionFilter: [];
}

export interface ISort {
  sortBy: ISortElement;
  ascOrder: boolean;
}

export interface ISortElement {
  name: string;
  element: string;
}
