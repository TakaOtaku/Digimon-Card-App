import { CARDSET } from '../../models';
import { AA, DigimonCard } from '../../models';
import DigimonCardsJson from './DigimonCards.json';

export function setupDigimonCards(cardset: CARDSET): DigimonCard[] {
  return cardset === CARDSET.English ? setupJsonENG() : setupJsonJAP();
}

function setupJsonENG(): DigimonCard[] {
  const digimonCards: DigimonCard[] = [...DigimonCardsJson];
  digimonCards.forEach((digimonCard: DigimonCard) => {
    digimonCard.AAs.forEach((aa: AA) => {
      digimonCards.push({
        ...digimonCard,
        cardImage: addAABeforeWebp(digimonCard.cardImage, aa.id),
        id: aa.id,
        illustrator: aa.illustrator,
        notes: aa.note,
        version: 'AA',
      });
    });
  });
  return digimonCards;
}

function setupJsonJAP(): DigimonCard[] {
  const japCards: DigimonCard[] = [];
  [...DigimonCardsJson].forEach((digimonCard: DigimonCard) => {
    japCards.push({ ...digimonCard, cardImage: addJBeforeWebp(digimonCard.cardImage) });
    digimonCard.JAAs.forEach((aa: AA) => {
      japCards.push({
        ...digimonCard,
        id: aa.id,
        illustrator: aa.illustrator,
        notes: aa.note,
        cardImage: addJBeforeWebp(addAABeforeWebp(digimonCard.cardImage, aa.id)),
        version: 'AA',
      });
    });
  });
  return japCards;
}

export function setupDigimonCardMap(cardset: CARDSET): Map<string, DigimonCard> {
  return cardset === CARDSET.English ? mapJsonToEngCardList() : mapJsonToJapCardList();
}

function mapJsonToEngCardList(): Map<string, DigimonCard> {
  const cards: Map<string, DigimonCard> = new Map<string, DigimonCard>();

  const digimonCards: DigimonCard[] = [...DigimonCardsJson];
  digimonCards.forEach((digimonCard: DigimonCard) => {
    cards.set(digimonCard.id, digimonCard);
    digimonCard.AAs.forEach((aa: AA) => {
      cards.set(aa.id, { ...digimonCard, illustrator: aa.illustrator, notes: aa.note, version: 'AA' });
    });
  });

  return cards;
}

export function addJBeforeWebp(imagePath: string): string {
  if (imagePath.endsWith('.webp') && !imagePath.endsWith('-J.webp')) {
    const index = imagePath.lastIndexOf('.webp');
    return imagePath.slice(0, index) + '-J' + imagePath.slice(index);
  } else {
    // If the imagePath does not end with ".webp", return it as is.
    return imagePath;
  }
}

function addAABeforeWebp(imagePath: string, AA: string): string {
  if (imagePath.endsWith('.webp')) {
    const index = imagePath.lastIndexOf('.webp');
    const newPath = imagePath.slice(0, index) + getP(AA) + imagePath.slice(index);
    return newPath;
  } else {
    // If the imagePath does not end with ".webp", return it as is.
    return imagePath;
  }
}

function getP(code: string): string {
  return '_P' + code.split('_P')[1];
}

function mapJsonToJapCardList(): Map<string, DigimonCard> {
  const cards: Map<string, DigimonCard> = new Map<string, DigimonCard>();

  const digimonCards: DigimonCard[] = [...DigimonCardsJson];
  digimonCards.forEach((digimonCard: DigimonCard) => {
    cards.set(digimonCard.id, { ...digimonCard, cardImage: addJBeforeWebp(digimonCard.cardImage) });
    digimonCard.JAAs.forEach((aa: AA) => {
      cards.set(aa.id, { ...digimonCard, illustrator: aa.illustrator, notes: aa.note, version: 'AA' });
    });
  });

  return cards;
}
