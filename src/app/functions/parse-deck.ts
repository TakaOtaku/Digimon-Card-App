import { ICard, ICountCard, IDeck, IDeckCard } from '../../models';
import { emptyDeck } from '../store/reducers/digimon.reducers';
import { compareIDs, setColors, setTags } from './digimon-card.functions';

export function stringToDeck(deckList: string, allCards: ICard[]): IDeck | null {
  let result: string[] = deckList.split('\n');

  let deck: IDeck = parseDeck(result, allCards);
  if (deck.cards.length > 0) {
    setDeckProperties(deck, allCards);
    return deck;
  }

  let deckTTS: IDeck = parseTTSDeck(deckList, allCards);
  if (deckTTS.cards.length > 0) {
    setDeckProperties(deck, allCards);
    return deckTTS;
  }

  return null;
}

function parseTTSDeck(deckList: string, allCards: ICard[]): IDeck {
  const deck: IDeck = { ...emptyDeck };

  let deckJson: string[] = [];
  try {
    deckJson = JSON.parse(deckList);
  } catch (e) {
    return deck;
  }

  deckJson.forEach((entry) => {
    const foundCard = findCardById(entry, allCards);
    if (foundCard) {
      incrementCardCount(deck.cards, foundCard.id);
    }
  });
  return deck;
}

function parseDeck(textArray: string[], allCards: ICard[]): IDeck {
  const deck: IDeck = { ...emptyDeck };

  textArray.forEach((line) => {
    const cardOrNull = parseLine(line, allCards);
    if (cardOrNull) {
      deck.cards.push(cardOrNull);
    }
  });
  return deck;
}

function parseLine(line: string, allCards: ICard[]): IDeckCard | null {
  let lineSplit: string[] = line.replace(/  +/g, ' ').split(' '); // Split the line by spaces and remove extra spaces
  const cardLine: boolean = /\d/.test(line); // Check if the line contains a number

  if (cardLine) {
    let matches = lineSplit.filter((string) => string.includes('-')); // Filter out the strings containing '-' -> Card ID
    matches = matches.filter((string) => {
      const split = string.split('-'); // Split the string by '-'
      return +split[split.length - 1] >>> 0; // Check if the last part of the split is a valid positive number
    });
    matches = matches.map((string) => {
      // Modify the matches
      if (string.includes('\r')) {
        // If the string contains '\r'
        return string.replace('\r', ''); // Remove the '\r'
      }
      return string;
    });

    if (matches.length === 0) {
      // If there are no valid matches
      return null;
    }

    let cardId = findCardId(matches[matches.length - 1]); // Get the ID of the last match
    if (!findCardById(cardId, allCards)) {
      // If the card ID is not found in the allCards array
      return null;
    }

    return { count: findNumber(lineSplit), id: cardId } as IDeckCard; // Return an object with the count and card ID as IDeckCard
  }

  return null;
}

function findCardId(id: string): string {
  console.log(id);
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

function setDeckProperties(deck: IDeck, allCards: ICard[]) {
  deck.tags = setTags(deck, allCards);
  deck.color = setColors(deck, allCards);
}

function findCardById(cardId: string, allCards: ICard[]): ICard | undefined {
  return allCards.find((card) => compareIDs(card.id, cardId));
}

function incrementCardCount(cards: ICountCard[], cardId: string) {
  const cardInDeck = cards.find((card) => card.id === cardId);
  if (cardInDeck) {
    cardInDeck.count++;
  } else {
    cards.push({ id: cardId, count: 1 });
  }
}
