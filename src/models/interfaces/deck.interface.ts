import { IColor } from './color.interface';
import { ICountCard } from './count-card.interface';
import { ITag } from './tag.interface';

export interface IDeck {
  id: string;
  cards: ICountCard[];
  color: IColor;

  sideDeck?: ICountCard[];

  title?: string;
  description?: string;
  tags?: ITag[];
  rating?: number;
  ratingCount?: number;
  user?: string;
  date?: string;

  cardImage?: string;
}
