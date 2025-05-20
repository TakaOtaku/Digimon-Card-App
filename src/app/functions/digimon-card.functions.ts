import { DigimonCard, dummyCard, ICountCard, IDeck, IDeckCard, ISelectItem, ITag, ITournamentDeck, tagsList } from '../../models';
import { ReleaseOrder } from '../../models/data/release-order.data';
import { ColorOrderMap, DeckColorMap } from '../../models/maps/color.map';
import { sortID } from './filter.functions';

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

/**
 * Determines the newest set present among the given cards and returns its corresponding tag.
 *
 * @param cards - The list of cards to check for set membership.
 * @returns An array containing the tag for the newest set found, or an empty array if none match.
 */
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

/**
 * Determines whether any banned cards are present in the provided card list.
 *
 * @returns True if at least one banned card is included; otherwise, false.
 *
 * @remark The banning logic is currently not implemented and always returns false.
 */
export function bannedCardsIncluded(cards: ICountCard[], allCards: DigimonCard[]): boolean {
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

/**
 * Determines if any restricted card appears more times than allowed in the provided card list.
 *
 * @returns True if a restricted card exceeds its allowed count; otherwise, false.
 */
export function tooManyRestrictedCardsIncluded(cards: ICountCard[], allCards: DigimonCard[]): boolean {
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

/**
 * Determines the primary color of a deck based on the most frequent card color.
 *
 * Returns the color with the highest card count in the deck, using a predefined color map. Defaults to "White" if the deck is empty or mapping fails.
 */
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

  const highest = colorArray.reduce((prev, current) => (prev.count > current.count ? prev : current));
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

/**
 * Compares two color names based on their predefined order.
 *
 * @param colorA - The first color to compare.
 * @param colorB - The second color to compare.
 * @returns A negative number if {@link colorA} comes before {@link colorB}, a positive number if after, or zero if they are equal in order.
 */
export function sortColors(colorA: string, colorB: string): number {
  const a: number = ColorOrderMap.get(colorA) ?? 0;
  const b: number = ColorOrderMap.get(colorB) ?? 0;
  return a - b;
}

/**
 * Converts an array of card count objects into full deck card objects by matching IDs with the complete card list.
 *
 * Handles special formatting for starter deck IDs by normalizing them before searching.
 *
 * @param cards - The array of card count objects to convert.
 * @param allCards - The complete list of available Digimon cards.
 * @returns An array of deck card objects with associated counts.
 */
export function mapToDeckCards(cards: ICountCard[], allCards: DigimonCard[]): IDeckCard[] {
  const deckCards: IDeckCard[] = [];

  if (!cards) {
    return deckCards;
  }

  cards.forEach((card) => {
    let cardSplit = card.id.split('-');
    if (cardSplit[0].includes('ST') && cardSplit[0].match(/ST0\d/)) {
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

/**
 * Calculates the total number of cards by summing the count property of each card in the array.
 *
 * @param deckCards - An array of deck cards or counted cards to total.
 * @returns The sum of all card counts in {@link deckCards}.
 */
export function getCountFromDeckCards(deckCards: IDeckCard[] | ICountCard[]): number {
  let number = 0;
  deckCards.forEach((card) => {
    number += card.count;
  });
  return number;
}

/**
 * Sorts a deck's cards by color and card type, grouping eggs, Digimon by color, tamers, and options.
 *
 * Digimon cards are grouped and sorted within each color by level and ID. Tamers and options are sorted by color and ID. Duplicate cards are removed in the final result.
 *
 * @param deck - The array of deck cards to sort.
 * @returns The sorted array of deck cards with duplicates removed.
 */
export function colorSort(deck: IDeckCard[]) {
  const eggs = deck.filter((card) => card.cardType === 'Digi-Egg').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  const red = deck
    .filter((card) => card.color.startsWith('Red') && card.cardType === 'Digimon')
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  const blue = deck
    .filter((card) => card.color.startsWith('Blue') && card.cardType === 'Digimon')
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  const yellow = deck
    .filter((card) => card.color.startsWith('Yellow') && card.cardType === 'Digimon')
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  const green = deck
    .filter((card) => card.color.startsWith('Green') && card.cardType === 'Digimon')
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  const black = deck
    .filter((card) => card.color.startsWith('Black') && card.cardType === 'Digimon')
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  const purple = deck
    .filter((card) => card.color.startsWith('Purple') && card.cardType === 'Digimon')
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));

  const white = deck
    .filter((card) => card.color.startsWith('White') && card.cardType === 'Digimon')
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));

  const tamer = deck.filter((card) => card.cardType === 'Tamer').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  const options = deck.filter((card) => card.cardType === 'Option').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  return [...new Set([...eggs, ...red, ...blue, ...yellow, ...green, ...black, ...purple, ...white, ...tamer, ...options])];
}

/**
 * Sorts deck cards by level and card type, grouping eggs, Digimon by level, tamers, and options.
 *
 * Cards are ordered as follows: Digi-Eggs, level 0 Digimon, level 3–7 Digimon, Tamers, then Options. Within each group, cards are sorted by color and then by ID.
 *
 * @param deck - The array of deck cards to sort.
 * @returns The sorted array of deck cards with duplicates removed.
 */
export function levelSort(deck: IDeckCard[]) {
  const eggs = deck.filter((card) => card.cardType === 'Digi-Egg').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  const lv0 = deck
    .filter((card) => card.cardLv === '-' && card.cardType === 'Digimon')
    .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  const lv3 = deck.filter((card) => card.cardLv === 'Lv.3').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));
  const lv4 = deck.filter((card) => card.cardLv === 'Lv.4').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));
  const lv5 = deck.filter((card) => card.cardLv === 'Lv.5').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));
  const lv6 = deck.filter((card) => card.cardLv === 'Lv.6').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));
  const lv7 = deck.filter((card) => card.cardLv === 'Lv.7').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  const tamer = deck.filter((card) => card.cardType === 'Tamer').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  const options = deck.filter((card) => card.cardType === 'Option').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  return [...new Set([...eggs, ...lv0, ...lv3, ...lv4, ...lv5, ...lv6, ...lv7, ...tamer, ...options])];
}

/**
 * Selects a representative Digimon card image for a deck, prioritizing the highest-level non-egg, non-level 7 Digimon.
 *
 * If no suitable Digimon card is found, returns a dummy card as a fallback.
 *
 * @returns The chosen Digimon card to represent the deck, or a dummy card if none are available.
 */
export function setDeckImage(deck: IDeck | ITournamentDeck, allCards: DigimonCard[]): DigimonCard {
  if (deck.cards && deck.cards.length === 0) {
    return JSON.parse(JSON.stringify(dummyCard));
  }
  let deckCards = mapToDeckCards(deck.cards, allCards);

  deckCards = deckCards.filter((card) => card.cardType === 'Digimon').filter((card) => card.cardLv !== 'Lv.7');

  if (deckCards.length === 0) {
    return JSON.parse(JSON.stringify(dummyCard));
  }
  try {
    deckCards = deckCards.sort((a, b) => Number(b.cardLv.replace('Lv.', '')) - Number(a.cardLv.replace('Lv.', '')));
  } catch (e) {}

  return deckCards.length > 0 ? deckCards[0] : JSON.parse(JSON.stringify(dummyCard));
}

/**
 * Converts an array of strings into select item objects with matching label and value.
 *
 * @param array - The list of strings to convert.
 * @returns An array of select items where each item's label and value are set to the corresponding string.
 */
export function itemsAsSelectItem(array: string[]): ISelectItem[] {
  return array.map((item) => ({ label: item, value: item }) as ISelectItem);
}

export function withoutJ(id: string): string {
  return id.replace('-J', '');
}
