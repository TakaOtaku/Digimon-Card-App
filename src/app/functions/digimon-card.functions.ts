import {
  DigimonCard,
  dummyCard,
  ICountCard,
  IDeck,
  IDeckCard,
  ISelectItem,
  ITag,
  ITournamentDeck,
  tagsList,
} from '../../models';
import { ReleaseOrder } from '../../models/data/release-order.data';
import { ColorOrderMap, DeckColorMap } from '../../models/maps/color.map';

export function setTags(deck: IDeck, allCards: DigimonCard[]) {
  let tags = [];

  tags = setNewestSet(deck.cards);

  if (bannedCardsIncluded(deck.cards, allCards)) {
    tags.push({ name: 'Illegal', color: 'Primary' });
  }

  if (tooManyRestrictedCardsIncluded(deck.cards, allCards)) {
    if (!tags.find((tag) => tag.name === 'Illegal')) {
      tags.push({ name: 'Illegal', color: 'Primary' });
    }
  }
  return tags;
}

export function setNewestSet(cards: ICountCard[]): ITag[] {
  const releaseOrder = ReleaseOrder;
  let set = '';
  releaseOrder.forEach((value) => {
    if (set) {
      return;
    }
    if (!cards) {
      return;
    }
    if (cards.find((card) => card.id.includes(value))) {
      set = value;
    }
  });
  const newestTag = tagsList.find((tag) => tag.name === set);
  return newestTag ? [newestTag] : [];
}

export function bannedCardsIncluded(
  cards: ICountCard[],
  allCards: DigimonCard[],
): boolean {
  let banned = false;
  if (!cards) {
    return false;
  }
  cards.forEach((card) => {
    if (banned) {
      return;
    }

    const foundCard = allCards.find((allCard) => allCard.id === card.id);
    /* TODO Implement
    if (foundCard) {
      banned = foundCard.restriction === 'Banned';
    }*/
  });
  return banned;
}

export function tooManyRestrictedCardsIncluded(
  cards: ICountCard[],
  allCards: DigimonCard[],
): boolean {
  let restricted = false;
  if (!cards) {
    return false;
  }
  cards.forEach((card) => {
    if (restricted) {
      return;
    }

    const foundCard = allCards.find((allCard) => allCard.id === card.id);
    /* TODO Implement
    if (foundCard) {
      const res = foundCard.restriction === 'Restricted to 1';
      restricted = res ? card.count > 1 : false;
    }*/
  });
  return restricted;
}

export function setColors(deck: IDeck, allCards: DigimonCard[]) {
  if (deck.cards.length === 0) {
    return ['White', { name: 'White', img: 'assets/images/decks/white.svg' }];
  }

  const cards: IDeckCard[] = mapToDeckCards(deck.cards, allCards);

  if (!cards) {
    return ['White', { name: 'White', img: 'assets/images/decks/white.svg' }];
  }

  const colorArray = [
    { name: 'Red', count: 0 },
    { name: 'Blue', count: 0 },
    { name: 'Yellow', count: 0 },
    { name: 'Green', count: 0 },
    { name: 'Black', count: 0 },
    { name: 'Purple', count: 0 },
    { name: 'White', count: 0 },
  ];

  cards.forEach((card) => {
    colorArray.forEach((color, index) => {
      if (card.color && card.color.includes(color.name)) {
        colorArray[index].count += card.count;
      }
    });
  });

  const highest = colorArray.reduce((prev, current) =>
    prev.count > current.count ? prev : current,
  );
  return DeckColorMap.get(highest.name);
}

export function compareIDs(idA: string, idB: string): boolean {
  const aST = idA.includes('ST');
  const bST = idB.includes('ST');
  if (aST && bST) {
    const splitA = idA.split('-');
    const splitB = idB.split('-');

    const numberA: number = +splitA[0].substring(2) >>> 0;
    const numberB: number = +splitB[0].substring(2) >>> 0;

    return numberA === numberB ? splitA[1] === splitB[1] : false;
  }
  return idA === idB;
}

export function formatId(id: string): string {
  return id.replace('ST0', 'ST').split('_P')[0];
}

export function deckIsValid(deck: IDeck, allCards: DigimonCard[]): string {
  const cardMap = new Map<string, DigimonCard>();

  allCards.forEach((card) => {
    cardMap.set(formatId(card.id), card);
  });

  let cardCount = 0;
  let eggCount = 0;

  if (!deck.cards || deck.cards.length === 0) {
    return 'Deck has no cards.';
  }

  deck.cards.forEach((card) => {
    const fullCard = cardMap.get(formatId(card.id));

    if (fullCard) {
      try {
        if (fullCard.cardType !== 'Digi-Egg') {
          cardCount += card.count;
        } else {
          eggCount += card.count;
        }
      } catch (e) {}
    }
  });

  if (cardCount !== 50) {
    return "Deck cannot be shared! You don't have 50 cards.";
  }

  if (eggCount > 5) {
    return 'Deck cannot be shared! You have more than 5 Eggs.';
  }

  if (!deck.title || deck.title === '' || deck.title === 'Imported Deck') {
    return 'Deck cannot be shared! You need a title.';
  }

  return '';
}

export function sortColors(colorA: string, colorB: string): number {
  const a: number = ColorOrderMap.get(colorA) ?? 0;
  const b: number = ColorOrderMap.get(colorB) ?? 0;
  return a - b;
}

export function mapToDeckCards(
  cards: ICountCard[],
  allCards: DigimonCard[],
): IDeckCard[] {
  const deckCards: IDeckCard[] = [];

  if (!cards) {
    return deckCards;
  }

  cards.forEach((card) => {
    let cardSplit = card.id.split('-');
    const numberNot10But0 =
      cardSplit[0].includes('0') && cardSplit[0] !== 'ST10';
    if (cardSplit[0].includes('ST') && numberNot10But0) {
      let searchId = cardSplit[0].replace('0', '') + '-' + cardSplit[1];
      let found = allCards.find((allCard) => searchId === allCard.id);
      deckCards.push({ ...found, count: card.count } as IDeckCard);
      return;
    }

    let found = allCards.find((allCard) => card.id === allCard.id);
    deckCards.push({ ...found, count: card.count } as IDeckCard);
  });

  return deckCards;
}

export function getCountFromDeckCards(
  deckCards: IDeckCard[] | ICountCard[],
): number {
  let number = 0;
  deckCards.forEach((card) => {
    number += card.count;
  });
  return number;
}

export function setDeckImage(
  deck: IDeck | ITournamentDeck,
  allCards: DigimonCard[],
): DigimonCard {
  if (deck.cards && deck.cards.length === 0) {
    return JSON.parse(JSON.stringify(dummyCard));
  }
  let deckCards = mapToDeckCards(deck.cards, allCards);

  deckCards = deckCards
    .filter((card) => card.cardType === 'Digimon')
    .filter((card) => card.cardLv !== 'Lv.7');

  if (deckCards.length === 0) {
    return JSON.parse(JSON.stringify(dummyCard));
  }
  try {
    deckCards = deckCards.sort(
      (a, b) =>
        Number(b.cardLv.replace('Lv.', '')) -
        Number(a.cardLv.replace('Lv.', '')),
    );
  } catch (e) {}

  return deckCards.length > 0
    ? deckCards[0]
    : JSON.parse(JSON.stringify(dummyCard));
}

export function itemsAsSelectItem(array: string[]): ISelectItem[] {
  return array.map((item) => ({ label: item, value: item }) as ISelectItem);
}

export function withoutJ(id: string): string {
  return id.replace('-J', '');
}
