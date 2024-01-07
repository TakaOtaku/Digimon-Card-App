import { CARDSET } from '../../models';
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
  cardset: CARDSET,
): Map<string, DigimonCard> {
  return cardset === CARDSET.English
    ? mapJsonToEngCardList()
    : mapJsonToJapCardList();
}

function mapJsonToEngCardList(): Map<string, DigimonCard> {
  const cards: Map<string, DigimonCard> = new Map<string, DigimonCard>();

  const digimonCards: DigimonCard[] = [...DigimonCardsJsonENG];
  digimonCards.forEach((digimonCard: DigimonCard) => {
    cards.set(digimonCard.id, digimonCard);
  });

  return cards;
}

function mapJsonToJapCardList(): Map<string, DigimonCard> {
  const cards: Map<string, DigimonCard> = new Map<string, DigimonCard>();

  const digimonCards: DigimonCard[] = [...DigimonCardsJsonJAP];
  digimonCards.forEach((digimonCard: DigimonCard) => {
    cards.set(digimonCard.id, {
      ...digimonCard,
      cardImage: addJBeforeWebp(digimonCard.cardImage),
    });
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
