import { DigimonCard, emptyDeck, ICountCard, IDeck, IDeckCard } from '../../models';
import { compareIDs, setColors, setTags } from './digimon-card.functions';

/**
 * Parses a Digimon deck from a string input, supporting both line-based and Tabletop Simulator (TTS) JSON formats.
 *
 * Attempts to interpret the input as a newline-separated deck list first; if unsuccessful, tries to parse it as a TTS JSON deck. Returns the constructed deck with assigned properties if successful, or `null` if parsing fails.
 *
 * @param deckList - The string representation of the deck, either as a list or TTS JSON.
 * @returns The parsed {@link IDeck} if successful, or `null` if the input is invalid or unrecognized.
 */
export function stringToDeck(deckList: string, allCards: DigimonCard[]): IDeck | null {
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

function parseTTSDeck(deckList: string, allCards: DigimonCard[]): IDeck {
  const deck: IDeck = { ...JSON.parse(JSON.stringify(emptyDeck)) };

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

function parseDeck(textArray: string[], allCards: DigimonCard[]): IDeck {
  const deck: IDeck = { ...JSON.parse(JSON.stringify(emptyDeck)) };

  textArray.forEach((line) => {
    const cardOrNull = parseLine(line, allCards);
    if (cardOrNull) {
      deck.cards.push(cardOrNull);
    }
  });
  return deck;
}

function isValidNumber(str: string): boolean {
  return !isNaN(Number(str));
}

function isValidNumberPNumber(str: string): boolean {
  const parts = str.split('_P');
  if (parts.length === 2) {
    const isValidNum1 = isValidNumber(parts[0]);
    const isValidNum2 = isValidNumber(parts[1]);
    return isValidNum1 && isValidNum2;
  }
  return false;
}

function parseLine(line: string, allCards: DigimonCard[]): IDeckCard | null {
  let lineSplit: string[] = line.replace(/  +/g, ' ').split(' '); // Split the line by spaces and remove extra spaces
  const cardLine: boolean = /\d/.test(line); // Check if the line contains a number

  if (!cardLine) {
    return null;
  }
  let matches = lineSplit.filter((string) => string.includes('-')); // Filter out the strings containing '-' -> Card ID
  matches = matches.filter((str) => {
    const parts = str.split('-');
    if (parts.length === 2) {
      return isValidNumber(parts[1]) || isValidNumberPNumber(parts[1]);
    }
    return false;
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

/**
 * Assigns tag and color properties to a deck based on its contents.
 *
 * Updates the {@link deck} object by setting its `tags` and `color` properties using the provided list of all cards.
 */
function setDeckProperties(deck: IDeck, allCards: DigimonCard[]) {
  deck.tags = setTags(deck, allCards);
  deck.color = setColors(deck, allCards);
}

/**
 * Searches for a Digimon card in the provided list by its ID.
 *
 * @param cardId - The ID of the card to search for.
 * @returns The matching {@link DigimonCard} if found; otherwise, `undefined`.
 */
function findCardById(cardId: string, allCards: DigimonCard[]): DigimonCard | undefined {
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
