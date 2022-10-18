import { IDeck } from './deck.interface';
import { IFilter } from './filter.interface';
import { ISort } from './sort.interface';

export interface IDigimonState {
  deck: IDeck;
  filter: IFilter;
  mobileCollectionView: boolean;
  addCardToDeck: string;
  sort: ISort;
  communityDeckSearch: string;
}
