import { find } from 'rxjs';
import { CARDSET, IDigimonCards } from '../../models';
import { DigimonCard } from '../../models';
import DigimonCardsJsonENG from './PreparedDigimonCardsENG.json';
import DigimonCardsJsonJAP from './PreparedDigimonCardsJAP.json';

export function setupDigimonCards(cardset: CARDSET): DigimonCard[] {
  return cardset === CARDSET.English ? setupJsonENG() : setupJsonJAP();
}

function setupJsonENG(): DigimonCard[] {
  const digimonCards: DigimonCard[] = [...DigimonCardsJsonENG];
  return digimonCards;
}

function setupJsonJAP(): DigimonCard[] {
  const japCards: DigimonCard[] = [...DigimonCardsJsonJAP];
  return japCards;
}

export function setupDigimonCardMap(
  cards: DigimonCard[],
): Map<string, DigimonCard> {
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
