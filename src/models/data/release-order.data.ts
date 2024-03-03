import { ICountCard, IDeck } from '../interfaces';

export const ReleaseOrder = [
  'BT17',
  'EX06',
  'BT16',
  'ST17',
  'BT15',
  'EX05',
  'BT14',
  'ST16',
  'ST15',
  'RB1',
  'BT13',
  'EX4',
  'BT12',
  'ST14',
  'BT11',
  'EX3',
  'BT10',
  'ST13',
  'ST12',
  'BT9',
  'EX2',
  'BT8',
  'ST10',
  'ST9',
  'BT7',
  'EX1',
  'BT6',
  'ST8',
  'ST7',
  'BT5',
  'BT4',
  'ST6',
  'ST5',
  'ST4',
  'BT3',
  'BT2',
  'BT1',
  'ST3',
  'ST2',
  'ST1',
];

// Function to get the release order index of a card
const getReleaseOrderIndex = (cardId: string): number => {
  const releaseOrderIndex = ReleaseOrder.indexOf(cardId);
  return releaseOrderIndex !== -1 ? releaseOrderIndex : Infinity;
};

export const sortByReleaseOrder = (deckA: IDeck, deckB: IDeck): number => {
  const newestCardIdA =
    deckA.cards.length > 0 ? findNewestCard(deckA.cards) : '';
  const newestCardIdB =
    deckB.cards.length > 0 ? findNewestCard(deckB.cards) : '';

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
