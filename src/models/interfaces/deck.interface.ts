import { IColor } from './color.interface';
import { ICountCard } from './count-card.interface';
import { ITag } from './tag.interface';

export interface IDeck {
  id: string;
  cards: ICountCard[];
  sideDeck: ICountCard[];
  color: IColor;
  title: string;
  description: string;
  tags: ITag[];
  date: string;
  user: string;
  userId: string;
  imageCardId: string;
  photoUrl?: string;
  likes: string[];
}
