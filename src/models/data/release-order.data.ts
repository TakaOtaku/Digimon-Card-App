import { ICountCard, IDeck } from '../interfaces';
import { ReleaseOrder } from './card-sets.data';

export { ReleaseOrder } from './card-sets.data';

// Function to get the release order index of a card
const getReleaseOrderIndex = (cardId: string): number => {
  const releaseOrderIndex = ReleaseOrder.indexOf(cardId);
  return releaseOrderIndex !== -1 ? releaseOrderIndex : Infinity;
};

export const sortByReleaseOrder = (deckA: IDeck, deckB: IDeck): number => {
  const newestCardIdA = deckA.cards.length > 0 ? findNewestCard(deckA.cards) : '';
  const newestCardIdB = deckB.cards.length > 0 ? findNewestCard(deckB.cards) : '';

  const releaseOrderIndexA = getReleaseOrderIndex(newestCardIdA);
  const releaseOrderIndexB = getReleaseOrderIndex(newestCardIdB);

  return releaseOrderIndexA - releaseOrderIndexB;
};

const findNewestCard = (cards: ICountCard[]): string => {
  let newestSet: string = '';
  let newestReleaseOrderIndex = Infinity;

  for (const card of cards) {
    const releaseOrderIndex = getReleaseOrderIndex(card.id.split('-', 1)[0]);
    if (releaseOrderIndex < newestReleaseOrderIndex) {
      newestReleaseOrderIndex = releaseOrderIndex;
      newestSet = card.id.split('-', 1)[0];
    }
  }

  return newestSet;
};
