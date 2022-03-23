export interface ISort {
  sortBy: ISortElement;
  ascOrder: boolean;
}

export interface ISortElement {
  name: string;
  element: string;
}
