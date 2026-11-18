import { DigimonCard, dummyCard, ICountCard, IDeck, IDeckCard, ISelectItem, ITag, replacements, tagsList } from '../../models';
import { cardsAllow50 } from '../../models/data/cards-50.data';
import { ReleaseOrder } from '../../models/data/release-order.data';
import { environment } from '../../environments/environment';
import { ColorOrderMap, DeckColorMap } from '../../models/maps/color.map';
import { sortID } from './filter.functions';

/**
 * Check if a card is a Digimon-type card (includes hybrid "Digimon/Option" type)
 */
export function isDigimonType(cardType: string): boolean {
  return cardType === 'Digimon' || cardType === 'Digimon/Option';
}

/**
 * Check if a card is an Option-type card (includes hybrid "Digimon/Option" type)
 */
export function isOptionType(cardType: string): boolean {
  return cardType === 'Option' || cardType === 'Digimon/Option';
}

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
      } catch (e) { }
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

export interface DeckCheck {
  label: string;
  ok: boolean;
}

/** Deck-building rules shown in the builder: 50 main cards, at most 5 Digi-Eggs, copy limits. */
export function deckChecks(cards: IDeckCard[]): DeckCheck[] {
  let main = 0;
  let eggs = 0;
  const copies = new Map<string, { name: string; count: number; max: number }>();

  cards.forEach((card) => {
    if (card.cardType === 'Digi-Egg') eggs += card.count;
    else main += card.count;

    const restriction = card.restrictions?.english;
    const max = restriction === 'Banned' ? 0 : restriction === 'Restricted to 1' ? 1 : cardsAllow50.includes(card.cardNumber) ? 50 : 4;
    const entry = copies.get(card.cardNumber) ?? { name: card.name?.english ?? card.cardNumber, count: 0, max };
    entry.count += card.count;
    copies.set(card.cardNumber, entry);
  });

  const overLimit = [...copies.values()].filter((c) => c.count > c.max).map((c) => c.name);

  return [
    { label: `Main deck ${main}/50`, ok: main === 50 },
    { label: `Digi-Eggs ${eggs}/5`, ok: eggs <= 5 },
    { label: overLimit.length ? `Over copy limit: ${overLimit.join(', ')}` : 'Copy limits', ok: overLimit.length === 0 },
  ];
}

export function sortColors(colorA: string, colorB: string): number {
  const a: number = ColorOrderMap.get(colorA) ?? 0;
  const b: number = ColorOrderMap.get(colorB) ?? 0;
  return a - b;
}

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
      if (found) {
        deckCards.push({ ...found, count: card.count } as IDeckCard);
      } else {
        // Card not found in store - create placeholder with minimal info
        deckCards.push({
          id: card.id,
          count: card.count,
          name: { english: card.id, japanese: '' },
          color: 'Unknown',
          cardType: 'Unknown',
          cardNumber: card.id,
        } as IDeckCard);
      }
      return;
    }

    let found = allCards.find((allCard) => card.id === allCard.id);
    if (found) {
      deckCards.push({ ...found, count: card.count } as IDeckCard);
    } else {
      // Card not found in store - create placeholder with minimal info
      deckCards.push({
        id: card.id,
        count: card.count,
        name: { english: card.id, japanese: '' },
        color: 'Unknown',
        cardType: 'Unknown',
        cardNumber: card.id,
      } as IDeckCard);
    }
  });

  return deckCards;
}

export function getCountFromDeckCards(deckCards: IDeckCard[] | ICountCard[]): number {
  let number = 0;
  deckCards.forEach((card) => {
    number += card.count;
  });
  return number;
}

export function colorSort(deck: IDeckCard[]) {
  const eggs = deck.filter((card) => card.cardType === 'Digi-Egg').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  const red = deck
    .filter((card) => card.color.startsWith('Red') && isDigimonType(card.cardType))
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  const blue = deck
    .filter((card) => card.color.startsWith('Blue') && isDigimonType(card.cardType))
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  const yellow = deck
    .filter((card) => card.color.startsWith('Yellow') && isDigimonType(card.cardType))
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  const green = deck
    .filter((card) => card.color.startsWith('Green') && isDigimonType(card.cardType))
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  const black = deck
    .filter((card) => card.color.startsWith('Black') && isDigimonType(card.cardType))
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  const purple = deck
    .filter((card) => card.color.startsWith('Purple') && isDigimonType(card.cardType))
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));

  const white = deck
    .filter((card) => card.color.startsWith('White') && isDigimonType(card.cardType))
    .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));

  const tamer = deck.filter((card) => card.cardType === 'Tamer').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  const options = deck.filter((card) => card.cardType === 'Option').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  return [...new Set([...eggs, ...red, ...blue, ...yellow, ...green, ...black, ...purple, ...white, ...tamer, ...options])];
}

export function levelSort(deck: IDeckCard[]) {
  const eggs = deck.filter((card) => card.cardType === 'Digi-Egg').sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  const lv0 = deck
    .filter((card) => card.cardLv === '-' && isDigimonType(card.cardType))
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

export function setDeckImage(deck: IDeck, allCards: DigimonCard[]): DigimonCard {
  if (deck.cards && deck.cards.length === 0) {
    return JSON.parse(JSON.stringify(dummyCard));
  }
  let deckCards = mapToDeckCards(deck.cards, allCards);

  deckCards = deckCards.filter((card) => isDigimonType(card.cardType)).filter((card) => card.cardLv !== 'Lv.7');

  if (deckCards.length === 0) {
    return JSON.parse(JSON.stringify(dummyCard));
  }
  try {
    deckCards = deckCards.sort((a, b) => Number(b.cardLv.replace('Lv.', '')) - Number(a.cardLv.replace('Lv.', '')));
  } catch (e) { }

  return deckCards.length > 0 ? deckCards[0] : JSON.parse(JSON.stringify(dummyCard));
}

export function itemsAsSelectItem(array: string[]): ISelectItem[] {
  return array.map((item) => ({ label: item, value: item }) as ISelectItem);
}

export interface DeckCardGroup {
  title: string;
  count: number;
  cards: IDeckCard[];
}

/** Groups a sorted deck by card type: Digi-Egg, Digimon, Tamer, Option, then anything else. */
export function groupDeckCards(cards: IDeckCard[]): DeckCardGroup[] {
  const groups = new Map<string, DeckCardGroup & { order: number }>();

  cards.forEach((card) => {
    let title = card.cardType;
    let order = 4;
    if (card.cardType === 'Digi-Egg') [title, order] = ['Digi-Egg', 0];
    else if (isDigimonType(card.cardType)) [title, order] = ['Digimon', 1];
    else if (card.cardType === 'Tamer') order = 2;
    else if (card.cardType === 'Option') order = 3;

    const group = groups.get(title) ?? { title, order, count: 0, cards: [] };
    group.count += card.count;
    group.cards.push(card);
    groups.set(title, group);
  });

  return [...groups.values()].sort((a, b) => a.order - b.order).map(({ title, count, cards }) => ({ title, count, cards }));
}

/** Deck groups for display; with grouping off, one untitled group holds every card. */
export function deckGroups(cards: IDeckCard[], grouped = true): DeckCardGroup[] {
  if (grouped) return groupDeckCards(cards);
  return cards.length ? [{ title: '', count: cards.reduce((sum, card) => sum + card.count, 0), cards }] : [];
}

/** Copies still needed per deck card, counting every owned printing of the same card number. */
export function missingCards(cards: IDeckCard[], collection: ICountCard[]): { card: IDeckCard; need: number }[] {
  const owned = new Map<string, number>();
  collection.forEach((c) => {
    const number = withoutJ(c.id).split('_P')[0];
    owned.set(number, (owned.get(number) ?? 0) + c.count);
  });
  return cards.map((card) => ({ card, need: Math.max(0, card.count - (owned.get(card.cardNumber) ?? 0)) })).filter((m) => m.need > 0);
}

export interface SetCompletion {
  set: string;
  owned: number;
  total: number;
}

export interface CardUsage {
  card: DigimonCard;
  decks: number;
  copies: number;
  percent: number;
  average: number;
}

/** How often each card number appears across decks (all printings together), most-included first. */
export function cardUsage(decks: IDeck[], allCards: DigimonCard[]): CardUsage[] {
  const byId = new Map(allCards.map((card) => [card.id, card]));
  const usage = new Map<string, { card: DigimonCard; decks: number; copies: number }>();

  decks.forEach((deck) => {
    const inDeck = new Map<string, number>();
    (deck.cards ?? []).forEach((entry) => {
      // Prefer the regular printing so rows show the normal art
      const card = byId.get(formatId(entry.id)) ?? byId.get(entry.id);
      if (!card) return;
      inDeck.set(card.cardNumber, (inDeck.get(card.cardNumber) ?? 0) + entry.count);
      if (!usage.has(card.cardNumber)) usage.set(card.cardNumber, { card, decks: 0, copies: 0 });
    });
    inDeck.forEach((copies, cardNumber) => {
      const row = usage.get(cardNumber)!;
      row.decks++;
      row.copies += copies;
    });
  });

  return [...usage.values()]
    .map((row) => ({ ...row, percent: (row.decks / decks.length) * 100, average: row.copies / row.decks }))
    .sort((a, b) => b.decks - a.decks || b.copies - a.copies);
}

export interface CompletionSettings {
  collectionMinimum: number;
  aaCollectionMinimum: number;
  collectionSets: string[];
  playsetTracking: boolean;
  unlimitedCollectionMinimum: number;
}

/**
 * Populates the SET COMPLETION section cards. Calculations are set by the Playset tracking settings
 * in the Collection section. 
 */
export function setCompletion(cards: DigimonCard[], collection: ICountCard[], settings: CompletionSettings): SetCompletion[] {
  if (settings.playsetTracking) {
    return setPlaysetCompletion(cards, collection, settings);
  }

  return setStandardCompletion(cards, collection, settings);
}

/**
 * Owned printings per set, newest set first, using the collection settings like the profile doughnuts:
 * regular printings need collectionMinimum copies; other printings count only when aaCollectionMinimum > 0
 * and need that many; collectionSets (when not empty) limits which sets are tracked.
 */
function setStandardCompletion(cards: DigimonCard[], collection: ICountCard[], settings: CompletionSettings): SetCompletion[] {
  const owned = new Map(collection.map((c) => [withoutJ(c.id), c.count]));
  const counted = new Set<string>();
  const bySet = new Map<string, SetCompletion>();
  const tracked = settings.collectionSets ?? [];

  cards.forEach((card) => {
    const id = withoutJ(card.id);
    const regular = card.version === 'Normal';
    if (!id.includes('-') || counted.has(id) || (!regular && !(settings.aaCollectionMinimum > 0))) return;
    const set = id.split('-')[0];
    if (tracked.length && !tracked.includes(set)) return;
    counted.add(id);

    const entry = bySet.get(set) ?? { set, owned: 0, total: 0 };
    entry.total++;
    const goal = Math.max(regular ? settings.collectionMinimum : settings.aaCollectionMinimum, 1);
    if ((owned.get(id) ?? 0) >= goal) entry.owned++;
    bySet.set(set, entry);
  });

  return ReleaseOrder.filter((set) => bySet.has(set)).map((set) => bySet.get(set)!);
}

/**
 * Owned printings per set, newest set first, using the Playset Tracking and Unlimited card collection goal 
 * collection settings like the profile doughnuts:
 * Playsets follow the following rules:
 *    - Unrestricted cards need at least 4 copies.
 *    - Banned and Restricted to 1 cards need at least 1 copy.
 *    - 50 copy cards use the Unlimited card collection goal value which is defaulted to 4 copies.
 * Playsets are calculated using all card art printings; collectionSets (when not empty) limits which sets are tracked.
 */
function setPlaysetCompletion(cards: DigimonCard[], collection: ICountCard[], settings: CompletionSettings): SetCompletion[] {
  const owned = new Map<string, number>();
  const bySet = new Map<string, SetCompletion>();
  const tracked = settings.collectionSets ?? [];

  // Aggregate collection quantities using normalized IDs.
  collection.forEach((card) => {
    const id = formatId(withoutJ(card.id)).split('-Errata')[0];
    owned.set(id, (owned.get(id) ?? 0) + card.count);
  });

  // Group all printings of the same card together.
  const cardVariants = new Map<string, DigimonCard[]>();

  cards.forEach((card) => {
    const id = formatId(withoutJ(card.id)).split('-Errata')[0];
    if (!id.includes('-')) return;
    const variants = cardVariants.get(id) ?? [];
    variants.push(card);
    cardVariants.set(id, variants);
  });

  cardVariants.forEach((variants, id) => {
    // Prefer the normal printing for card metadata and set attribution.
    const card = variants.find((c) => c.version === 'Normal') ?? variants[0];
    const set = id.split('-')[0];
    if (tracked.length && !tracked.includes(set)) return;
    const entry = bySet.get(set) ?? { set, owned: 0, total: 0 };
    entry.total++;

    const restriction = card.restrictions?.english;
    let goal = 4;
    if (restriction === 'Banned' || restriction === 'Restricted to 1') {
      goal = 1;
    } else if (cardsAllow50.includes(card.cardNumber)) {
      goal = Math.min(50, Math.max(1, settings.unlimitedCollectionMinimum ?? 4));
    }

    const totalOwned = owned.get(id) ?? 0;
    if (totalOwned >= goal) {
      entry.owned++;
    }

    bySet.set(set, entry);
  });

  return ReleaseOrder.filter((set) => bySet.has(set)).map((set) => bySet.get(set)!);
}

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Keywords longer than this (Decode, Partition, ...) may wrap onto several lines instead of running out of the box
const LONG_KEYWORD = 22;

// Keyword families with a number or phase in them. The wiki writes "[Assembly\u00a0-4]" with a no-break space,
// so every pattern runs on text where that space is a normal one.
const KEYWORD_FAMILIES = [
  /\[Assembly [-\u2212\u2013]\d+\]/g,
  /\[DigiXros [-\u2212\u2013]\d+\]/g,
  /\[(?:Start|End) of (?:Your|Opponent's) (?:Turn|Main Phase|Attack)\]/g,
  /\[Twice Per Turn\]/g,
];

// Card colors named in a text ("red or blue Digimon", "Blue Lv.4", "Digimon/Red/6000 DP") become small colored labels, like on the wiki
const COLOR_WORDS = /\b([Rr]ed|[Bb]lue|[Yy]ellow|[Gg]reen|[Bb]lack|[Pp]urple|[Ww]hite)\b/g;

// Text a card gives out in quotation marks is shown in italics
const QUOTES = /"[^"\n]*"|“[^”\n]*”/g;

/** The badge style of a keyword, picked by how the printed card colors it. */
function keywordKind(text: string): string {
  if (text.startsWith('＜')) return 'kw-angle';
  if (text.startsWith('Overflow')) return 'kw-overflow';
  if (text === '[Once Per Turn]' || text === '[Twice Per Turn]') return 'kw-once';
  if (text.startsWith('[Assembly') || text.startsWith('[DigiXros') || text === '[Link]' || text === '[Arts Digivolve]') return 'kw-assembly';
  if (text === '[Rule]') return 'kw-rule';
  if (text === '{Hand}' || text === '{Trash}' || text === '{Breeding}' || text === '{Security}') return 'kw-hand';
  if (text.startsWith('[')) return 'kw-bracket';
  return 'kw-other';
}

/**
 * Wraps the keywords of an effect text, like [On Play] or ＜Blocker＞, in a colored badge and names of card colors in a
 * label of that color (rendered via innerHTML). Known keywords come from the replacement table, any other ＜...＞ is a
 * keyword too. The text itself is HTML-escaped.
 */
export function highlightKeywords(rawEffect: string): string {
  const effect = rawEffect.replace(/\u00a0/g, ' ');
  type Found = { start: number; end: number; tooltip: string; cls?: string };
  const found: Found[] = [];
  for (const [pattern, , tooltip] of replacements) {
    for (const m of effect.matchAll(new RegExp(pattern.source, 'g'))) found.push({ start: m.index!, end: m.index! + m[0].length, tooltip });
  }
  for (const pattern of KEYWORD_FAMILIES) {
    for (const m of effect.matchAll(pattern)) found.push({ start: m.index!, end: m.index! + m[0].length, tooltip: '' });
  }
  for (const m of effect.matchAll(/＜[^＞]+＞/g)) found.push({ start: m.index!, end: m.index! + m[0].length, tooltip: '' });
  for (const m of effect.matchAll(/\{(?:Hand|Trash|Breeding|Security)\}/g))
    found.push({ start: m.index!, end: m.index! + m[0].length, tooltip: '' });

  const pinkSecurity = new Set<number>();
  for (const m of effect.matchAll(
    /\[Security\]([ \t]*)\[(?:All Turns|Your Turn|Opponent's Turn|End of Your Turn|End of Opponent's Turn|End of All Turns)\]/g,
  )) {
    pinkSecurity.add(m.index!);
    pinkSecurity.add(m.index! + '[Security]'.length + m[1].length);
  }

  // Color names count only outside brackets, so [Blue Flare] or a card name stays plain
  let depth = 0;
  const outside = [...effect].map((c) => {
    if (c === '[' || c === '＜') depth++;
    const ok = depth === 0;
    if (c === ']' || c === '＞') depth = Math.max(0, depth - 1);
    return ok;
  });
  for (const m of effect.matchAll(COLOR_WORDS)) {
    if (outside[m.index!] && outside[m.index! + m[0].length - 1]) {
      found.push({ start: m.index!, end: m.index! + m[0].length, tooltip: '', cls: `kc kc-${m[0].toLowerCase()}` });
    }
  }

  // Longest first, so ＜Decode ([Aegiomon])＞ wins over a shorter pattern inside it
  const matches: Found[] = [];
  for (const m of found.sort((x, y) => y.end - y.start - (x.end - x.start) || x.start - y.start)) {
    if (!matches.some((k) => m.start < k.end && m.end > k.start)) matches.push(m);
  }
  matches.sort((x, y) => x.start - y.start);

  // Quote boundaries inside a keyword are ignored, so a badge is never cut in two
  const inside = (pos: number) => matches.some((m) => pos > m.start && pos < m.end);
  const quoteStarts = new Set<number>();
  const quoteEnds = new Set<number>();
  for (const q of effect.matchAll(QUOTES)) {
    if (!inside(q.index!) && !inside(q.index! + q[0].length)) {
      quoteStarts.add(q.index!);
      quoteEnds.add(q.index! + q[0].length);
    }
  }
  const cuts = [...new Set([0, effect.length, ...matches.flatMap((m) => [m.start, m.end]), ...quoteStarts, ...quoteEnds])].sort((x, y) => x - y);

  let html = '';
  for (let i = 0; i < cuts.length - 1; i++) {
    const start = cuts[i];
    const end = cuts[i + 1];
    if (quoteEnds.has(start)) html += '</em>';
    if (quoteStarts.has(start)) html += '<em>';
    const m = matches.find((k) => k.start === start);
    if (m) {
      const text = effect.slice(m.start, m.end);
      const cls = m.cls ?? `kw ${pinkSecurity.has(m.start) ? 'kw-hand' : keywordKind(text)}${text.length > LONG_KEYWORD ? ' kw-long' : ''}`;
      html += `<span class="${cls}"${m.tooltip ? ` title="${escapeHtml(m.tooltip)}"` : ''}>${escapeHtml(text)}</span>`;
    } else {
      html += escapeHtml(effect.slice(start, end));
    }
  }
  if (quoteEnds.has(effect.length)) html += '</em>';
  return html;
}

export function withoutJ(id: string): string {
  return id.replace('-J', '');
}

/** Tier list / deck images: bare card IDs and bundled card paths resolve to the card image CDN. */
export function ensureCdnUrl(imageUrl: string): string {
  if (!imageUrl) {
    return 'assets/images/digimon-card-back.webp';
  }

  // If it's already a full CDN URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Bundled card images ship as 'assets/images/cards/BT1-001.webp' -> rewrite to CDN base
  const cardImagePrefix = 'assets/images/cards/';
  if (imageUrl.startsWith(cardImagePrefix)) {
    return environment.cardImageBaseUrl + imageUrl.slice(cardImagePrefix.length);
  }

  // Local assets (placeholders, card back) stay as-is
  if (imageUrl.startsWith('assets/')) {
    return imageUrl;
  }

  // For bare card IDs like 'BT1-001', construct the CDN path
  return environment.cardImageBaseUrl + imageUrl + '.webp';
}
