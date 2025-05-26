import { ICountCard } from '@models';
import { cardsAllow50 } from '../../models/data/cards-50.data';

export function checkSpecialCardCounts(card: ICountCard): number {
  // Check if Card is in the special list (cardsAllow50) that allows up to 50 copies
  if (cardsAllow50.includes(card!.id)) {
    return card.count > 50 ? 50 : card.count;
  }
  return card.count > 4 ? 4 : card.count;
}
