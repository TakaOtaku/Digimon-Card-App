import { ICountCard } from '../../models';

export function checkSpecialCardCounts(card: ICountCard): number {
  if (
    card!.id.includes('BT6-085') ||
    card!.id.includes('EX2-046') ||
    card!.id.includes('BT11-061')
  ) {
    return card.count > 50 ? 50 : card.count;
  }
  return card.count > 4 ? 4 : card.count;
}
