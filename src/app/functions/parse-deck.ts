import { DigimonCard, emptyDeck, ICountCard, IDeck, IDeckCard } from '../../models';
import { compareIDs, setColors, setTags } from './digimon-card.functions';

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
  let lineSplit: string[] = line.replace(/  +/g, ' ').trim().split(' '); // Split the line by spaces and remove extra spaces
  const cardLine: boolean = /\d/.test(line); // Check if the line contains a number

  if (!cardLine) {
    return null;
  }

  // Find card ID matches (strings containing '-')
  let idMatches = lineSplit.filter((string) => string.includes('-')); // Filter out the strings containing '-' -> Card ID
  idMatches = idMatches.filter((str) => {
    const parts = str.split('-');
    if (parts.length === 2) {
      return isValidNumber(parts[1]) || isValidNumberPNumber(parts[1]);
    }
    return false;
  });

  idMatches = idMatches.map((string) => {
    // Modify the matches
    if (string.includes('\r')) {
      // If the string contains '\r'
      return string.replace('\r', ''); // Remove the '\r'
    }
    return string;
  });

  if (idMatches.length === 0) {
    // If there are no valid matches
    return null;
  }

  let cardId = findCardId(idMatches[idMatches.length - 1]); // Get the ID of the last match
  if (!findCardById(cardId, allCards)) {
    // If the card ID is not found in the allCards array
    return null;
  }

  // Find quantity - look for standalone numbers that aren't part of card IDs
  let quantity = 1; // Default quantity
  for (const part of lineSplit) {
    const cleanPart = part.replace('\r', '');
    // Check if it's a standalone number (not part of a card ID)
    if (isValidNumber(cleanPart) && !cleanPart.includes('-')) {
      const num = parseInt(cleanPart, 10);
      if (num > 0) {
        quantity = num;
        break; // Take the first valid standalone number as quantity
      }
    }
  }

  return { count: quantity, id: cardId } as IDeckCard;
}

function findCardId(id: string): string {
  if (id.includes('ST')) {
    const splitA = id.split('-');
    const numberA: number = +splitA[0].substring(2) >>> 0;
    return 'ST' + numberA + '-' + splitA[1];
  }
  return id;
}

function setDeckProperties(deck: IDeck, allCards: DigimonCard[]) {
  deck.tags = setTags(deck, allCards);
  deck.color = setColors(deck, allCards);
}

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
