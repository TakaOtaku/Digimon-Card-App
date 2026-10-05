import { CARDSET } from '@models';
import { DigimonCard } from '@models';
import DigimonCardsJsonENG from './PreparedDigimonCardsENG.json';
import DigimonCardsJsonJAP from './PreparedDigimonCardsJAP.json';
import { environment } from '../../environments/environment';

const CARD_IMAGE_PREFIX = 'assets/images/cards/';

// Card image paths ship as bundle paths in the JSON; rewrite them to the CDN base at load time.
function withCdnImage(card: DigimonCard): DigimonCard {
  const img = card.cardImage;
  if (img && img.startsWith(CARD_IMAGE_PREFIX)) {
    return { ...card, cardImage: environment.cardImageBaseUrl + img.slice(CARD_IMAGE_PREFIX.length) };
  }
  return card;
}

export function setupDigimonCards(cardset: CARDSET): DigimonCard[] {
  return cardset === CARDSET.English ? setupJsonENG() : setupJsonJAP();
}

function setupJsonENG(): DigimonCard[] {
  const digimonCards: DigimonCard[] = [...DigimonCardsJsonENG];
  return digimonCards.filter((card) => card.name.japanese && card.name.japanese.trim() !== '').map(withCdnImage);
}

function setupJsonJAP(): DigimonCard[] {
  const japCards: DigimonCard[] = [...DigimonCardsJsonJAP];
  return japCards.filter((card) => card.name.japanese && card.name.japanese.trim() !== '').map(withCdnImage);
}

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
  digimonCards
    .filter((card) => card.name.japanese && card.name.japanese.trim() !== '')
    .forEach((digimonCard: DigimonCard) => {
      cards.set(digimonCard.id, withCdnImage(digimonCard));
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
