import { CARDSET } from '@models';
import { DigimonCard } from '@models';
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

// Fetched as plain JSON instead of bundled: both languages compiled into the JS (~27 MB) blocked taps at startup
export async function setupDigimonCards(cardset: CARDSET): Promise<DigimonCard[]> {
  const file = cardset === CARDSET.English ? 'PreparedDigimonCardsENG.json' : 'PreparedDigimonCardsJAP.json';
  const response = await fetch('assets/cardlists/' + file);
  if (!response.ok) {
    throw new Error(`Loading ${file} failed: ${response.status}`);
  }
  const cards: DigimonCard[] = await response.json();
  return cards.filter((card) => card.name.japanese && card.name.japanese.trim() !== '').map(withCdnImage);
}

export function setupDigimonCardMap(cards: DigimonCard[]): Map<string, DigimonCard> {
  const digimonCardMap = new Map<string, DigimonCard>();
  cards.forEach((digimonCard) => {
    digimonCardMap.set(digimonCard.id, digimonCard);
  });
  return digimonCardMap;
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
