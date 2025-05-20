import { ICountCard } from '../../models';

/**
 * Returns the allowed count for a card, capping special cards at 50 and others at 4.
 *
 * @param card - The card to check, including its {@link ICountCard.id} and {@link ICountCard.count}.
 * @returns The card's count, capped at 50 for cards with IDs containing 'BT6-085', 'EX2-046', or 'BT11-061', and capped at 4 for all others.
 */
export function checkSpecialCardCounts(card: ICountCard): number {
  if (card!.id.includes('BT6-085') || card!.id.includes('EX2-046') || card!.id.includes('BT11-061')) {
    return card.count > 50 ? 50 : card.count;
  }
  return card.count > 4 ? 4 : card.count;
}
