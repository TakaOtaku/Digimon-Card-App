import { CARDSET } from '@models';
import { DigimonCard } from '@models';
import DigimonCardsJsonENG from './PreparedDigimonCardsENG.json';
import DigimonCardsJsonJAP from './PreparedDigimonCardsJAP.json';

export function setupDigimonCards(cardset: CARDSET): DigimonCard[] {
  return cardset === CARDSET.English ? setupJsonENG() : setupJsonJAP();
}

function setupJsonENG(): DigimonCard[] {
  const digimonCards: DigimonCard[] = [...DigimonCardsJsonENG];
  return digimonCards;
}

/**
 * Loads and returns an array of Digimon cards from the Japanese JSON data.
 *
 * @returns An array of DigimonCard objects representing the Japanese card set.
 */
function setupJsonJAP(): DigimonCard[] {
  const japCards: DigimonCard[] = [...DigimonCardsJsonJAP];
  return japCards;
}

/**
 * Creates a map of Digimon cards keyed by their unique ID.
 *
 * @param cards - An array of DigimonCard objects to be mapped.
 * @returns A Map where each key is a card's {@link DigimonCard.id} and the value is the corresponding DigimonCard object.
 */
export function setupDigimonCardMap(cards: DigimonCard[]): Map<string, DigimonCard> {
  const digimonCardMap = new Map<string, DigimonCard>();
  cards.forEach((digimonCard) => {
    digimonCardMap.set(digimonCard.id, digimonCard);
  });
  return digimonCardMap;
}

function mapJsonToEngCardList(): Map<string, DigimonCard> {
  const cards: Map<string, DigimonCard> = new Map<string, DigimonCard>();

  const digimonCards: DigimonCard[] = [...DigimonCardsJsonENG];
  digimonCards.forEach((digimonCard: DigimonCard) => {
    cards.set(digimonCard.id, digimonCard);
  });

  return cards;
}

/* =========================
       Support Functions
   ========================= */
export function addJBeforeWebp(imagePath: string): string {
  if (imagePath.endsWith('.webp') && !imagePath.endsWith('-J.webp')) {
    const index = imagePath.lastIndexOf('.webp');
    return imagePath.slice(0, index) + '-J' + imagePath.slice(index);
  } else {
    // If the imagePath does not end with ".webp", return it as is.
    return imagePath;
  }
}

export function addSampleBeforeWebp(imagePath: string): string {
  if (imagePath.endsWith('.webp') && !imagePath.endsWith('-Sample-J.webp')) {
    const index = imagePath.lastIndexOf('.webp');
    return imagePath.slice(0, index) + '-Sample-J' + imagePath.slice(index);
  } else {
    // If the imagePath does not end with ".webp", return it as is.
    return imagePath;
  }
}
