import * as uuid from 'uuid';
import { ICard, ICountCard, IDeck, IDeckCard } from '../../models';
import { compareIDs, setColors, setTags } from './digimon-card.functions';

export function stringToDeck(
  deckList: string,
  allCards: ICard[]
): IDeck | null {
  let result: string[] = deckList.split('\n');

  let deck: IDeck = parseDeck(result, allCards);
  if (deck.cards.length > 0) {
    deck.tags = setTags(deck, allCards);
    deck.color = setColors(deck, allCards);
    return deck;
  }

  let deckTTS: IDeck = parseTTSDeck(deckList, allCards);
  if (deckTTS.cards.length > 0) {
    deckTTS.tags = setTags(deckTTS, allCards);
    deckTTS.color = setColors(deckTTS, allCards);
    return deckTTS;
  }

  return null;
}

function parseTTSDeck(deckList: string, allCards: ICard[]): IDeck {
  const deck: IDeck = {
    title: 'Imported Deck',
    id: uuid.v4(),
    description: '',
    date: new Date().toString(),
    color: { name: 'White', img: 'assets/decks/white.svg' },
    cards: [],
    tags: [],
    user: '',
    userId: '',
    imageCardId: 'BT1-001',
    likes: [],
  };

  let deckJson: string[] = [];
  try {
    deckJson = JSON.parse(deckList);
  } catch (e) {
    return deck;
  }

  deckJson.forEach((entry) => {
    const foundCard = allCards.find((card) => card.id === entry);
    if (foundCard) {
      const cardInDeck = deck.cards.find(
        (card: ICountCard) => card.id === foundCard.id
      );
      if (cardInDeck) {
        cardInDeck.count++;
      } else {
        deck.cards.push({ id: foundCard.id, count: 1 });
      }
    }
  });
  return deck;
}

function parseDeck(textArray: string[], allCards: ICard[]): IDeck {
  const deck: IDeck = {
    title: 'Imported Deck',
    id: uuid.v4(),
    description: '',
    date: new Date().toString(),
    color: { name: 'White', img: 'assets/decks/white.svg' },
    cards: [],
    tags: [],
    user: '',
    userId: '',
    imageCardId: 'BT1-001',
    likes: [],
  };

  textArray.forEach((line) => {
    const cardOrNull = parseLine(line, allCards);
    if (cardOrNull) {
      deck.cards.push(cardOrNull);
    }
  });
  return deck;
}

function parseLine(line: string, allCards: ICard[]): IDeckCard | null {
  let lineSplit: string[] = line.replace(/  +/g, ' ').split(' ');
  const cardLine: boolean = /\d/.test(line);
  if (cardLine) {
    let matches = lineSplit.filter((string) => string.includes('-'));
    matches = matches.filter((string) => {
      const split = string.split('-');
      return +split[split.length - 1] >>> 0;
    });
    matches = matches.map((string) => {
      if (string.includes('\r')) {
        return string.replace('\r', '');
      }
      return string;
    });
    if (matches.length === 0) {
      return null;
    }
    let cardId = findCardId(matches[matches.length - 1]);
    if (!allCards.find((card) => compareIDs(card.id, cardId))) {
      return null;
    }

    return { count: findNumber(lineSplit), id: cardId } as IDeckCard;
  }
  return null;
}

function findCardId(id: string): string {
  if (id.includes('ST')) {
    const splitA = id.split('-');
    const numberA: number = +splitA[0].substring(2) >>> 0;
    return 'ST' + numberA + '-' + splitA[1];
  }
  return id;
}

function findNumber(array: string[]): number {
  let count = 0;
  array.forEach((string) => {
    let number: number = +string >>> 0;
    if (number > 0) {
      count = number;
    }
  });
  return count;
}
