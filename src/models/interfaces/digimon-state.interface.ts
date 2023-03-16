import { ProductCM } from '../../app/service/card-market.service';
import { DRAG } from '../enums/drag.enum';
import { IBlog } from './blog-entry.interface';
import { ICard } from './card.interface';
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
  communityDecks: IDeck[];
  blogs: IBlog[];
  priceGuideCM: ProductCM[];
  draggedCard: IDraggedCard;
}
export interface IDraggedCard {
  card: ICard;
  drag: DRAG;
}
