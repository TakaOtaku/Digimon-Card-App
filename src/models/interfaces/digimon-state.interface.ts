import { IBlog } from './blog-entry.interface';
import { IDeck } from './deck.interface';
import { IDraggedCard } from './dragged-card.interface';
import { IFilter } from './filter.interface';
import { ISort } from './sort.interface';

export * from './digimon-state.interface';
export interface IDigimonState {
  deck: IDeck;
  filter: IFilter;
  mobileCollectionView: boolean;
  addCardToDeck: string;
  sort: ISort;
  communityDeckSearch: string;
  communityDecks: IDeck[];
  blogs: IBlog[];
  draggedCard: IDraggedCard;
}
