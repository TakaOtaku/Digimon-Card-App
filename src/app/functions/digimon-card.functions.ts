import { englishCards } from '../../assets/cardlists/eng/english';
import preReleaseJSON from '../../assets/cardlists/eng/preRelease.json';
import { japaneseCards } from '../../assets/cardlists/jap/japanese';
import {
  ColorOrderMap,
  DeckColorMap,
  ICard,
  ICountCard,
  IDeck,
  IDeckCard,
  tagsList,
} from '../../models';
import { CARDSET } from '../../models/card-set.enum';
import { ITag } from '../../models/interfaces/tag.interface';

export function setTags(tags: ITag[], deck: IDeck, allCards: ICard[]) {
  tags = [];

  tags.push(setNewestSet(deck.cards));

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

export function setNewestSet(cards: ICountCard[]): ITag {
  const releaseOrder = [
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
  let set = '';
  releaseOrder.forEach((value) => {
    if (set) {
      return;
    }
    if (cards.find((card) => card.id.includes(value))) {
      set = value;
    }
  });
  return (
    tagsList.find((tag) => tag.name === set) ?? { name: '', color: 'Primary' }
  );
}

export function bannedCardsIncluded(
  cards: ICountCard[],
  allCards: ICard[]
): boolean {
  let banned = false;
  cards.forEach((card) => {
    if (banned) {
      return;
    }

    const foundCard = allCards.find((allCard) => allCard.id === card.id);
    if (foundCard) {
      banned = foundCard.restriction === 'Banned';
    }
  });
  return banned;
}

export function tooManyRestrictedCardsIncluded(
  cards: ICountCard[],
  allCards: ICard[]
): boolean {
  let restricted = false;
  cards.forEach((card) => {
    if (restricted) {
      return;
    }

    const foundCard = allCards.find((allCard) => allCard.id === card.id);
    if (foundCard) {
      const res = foundCard.restriction === 'Restricted to 1';
      restricted = res ? card.count > 1 : false;
    }
  });
  return restricted;
}

export function setColors(deck: IDeck, allCards: ICard[], selectedColor: any) {
  const cards: IDeckCard[] = mapToDeckCards(deck.cards, allCards);
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
    prev.count > current.count ? prev : current
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

export function getPNG(cardSRC: string): string {
  let engRegExp = new RegExp('\\beng\\b');
  let japRegExp = new RegExp('\\bjap\\b');
  let preReleaseRegExp = new RegExp('\\bpre-release\\b');

  if (engRegExp.test(cardSRC)) {
    return cardSRC
      .replace(engRegExp, 'eng/png')
      .replace(new RegExp('\\b.webp\\b'), '.png');
  } else if (japRegExp.test(cardSRC)) {
    return cardSRC
      .replace(japRegExp, 'jap/png')
      .replace(new RegExp('\\b.webp\\b'), '.png');
  } else {
    return cardSRC
      .replace(preReleaseRegExp, 'pre-release/png')
      .replace(new RegExp('\\b.webp\\b'), '.png');
  }
}

export function setupAllDigimonCards(): ICard[] {
  const allCards: ICard[] = setupDigimonCards(CARDSET.Both);

  allCards.sort(function (a, b) {
    if (a.cardNumber < b.cardNumber) {
      return -1;
    }
    if (a.cardNumber > b.cardNumber) {
      return 1;
    }
    return 0;
  });
  return allCards;
}

export function deckIsValid(deck: IDeck, allCards: ICard[]): string {
  let cardCount = 0;
  let eggCount = 0;

  if (!deck.cards) {
    return 'Deck has no cards.';
  }

  deck.cards.forEach((card) => {
    const fullCard = allCards.find((a) => a.id === formatId(card.id))!;
    if (fullCard.cardType !== 'Digi-Egg') {
      cardCount += card.count;
    } else {
      eggCount += card.count;
    }
  });

  if (cardCount != 50) {
    return "Deck was can not be shared! You don't have 50 cards.";
  }

  if (eggCount > 5) {
    return 'Deck was can not be shared! You have more than 5 Eggs.';
  }

  if (!deck.title) {
    return 'Deck was can not be shared! You need a title.';
  }
  return '';
}

export function setupDigimonCards(digimonSet: string): ICard[] {
  let allCards: ICard[] = [];
  if (digimonSet === CARDSET.English) {
    allCards = englishCards.concat(preReleaseJSON);
  }
  if (digimonSet === CARDSET.Japanese) {
    allCards = [...new Set(japaneseCards)];
  }
  if (digimonSet === CARDSET.Both) {
    allCards = englishCards.concat(preReleaseJSON);
    japaneseCards.forEach((japCard) => {
      if (allCards.find((card) => card.id === japCard.id)) {
        return;
      }
      allCards.push(japCard);
    });
  }

  allCards.sort(function (a, b) {
    const aSet = a.cardNumber.split('-');
    const bSet = b.cardNumber.split('-');
    const aNumber: number = +aSet[1] >>> 0;
    const bNumber: number = +bSet[1] >>> 0;
    return aSet[0].localeCompare(bSet[0]) || aNumber - bNumber;
  });
  return allCards;
}

export function sortColors(colorA: string, colorB: string): number {
  const a: number = ColorOrderMap.get(colorA) ?? 0;
  const b: number = ColorOrderMap.get(colorB) ?? 0;
  return a - b;
}

export function mapToDeckCards(
  cards: ICountCard[],
  allCards: ICard[]
): IDeckCard[] {
  const deckCards: IDeckCard[] = [];

  cards.forEach((card) => {
    let found = allCards.find((allCard) => card.id === allCard.id);
    deckCards.push({ ...found, count: card.count } as IDeckCard);
  });

  return deckCards;
}
