export interface ISettings {
  filter: IFilter;
  sort : ISort;
  cardSize: number;
  collectionMode: boolean;
}

export interface IFilter {
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
