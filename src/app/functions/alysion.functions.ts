import { ALYSION_RESTRICTED, ALYSION_REUSED_SETS } from '../../models/data/alysion.data';
import { DeckFormat } from '../../models/interfaces/deck.interface';
import { DigimonCard } from '../../models/interfaces/digimon-card.interface';

const ALYSION_ONLY_SET = /^(BD|ED|SD)\d+$/;
const setOf = (cardNumber: string) => cardNumber.split('-')[0];

export function deckFormat(deck: { format?: DeckFormat }): DeckFormat {
  return deck.format ?? 'paper';
}

export function isAlysionSet(set: string): boolean {
  return ALYSION_ONLY_SET.test(set) || ALYSION_REUSED_SETS.includes(set);
}

// Alysion's own cards with every print; reused paper cards only as their base print
export function isInAlysionPool(card: Pick<DigimonCard, 'id' | 'cardNumber'>): boolean {
  const set = setOf(card.cardNumber);
  return ALYSION_ONLY_SET.test(set) || (ALYSION_REUSED_SETS.includes(set) && card.id === card.cardNumber);
}

export function restrictionFor(card: DigimonCard, format: DeckFormat): string {
  if (format === 'paper') return card.restrictions?.english;
  return ALYSION_RESTRICTED.includes(card.cardNumber) ? 'Restricted to 1' : 'Unrestricted';
}

export function poolFor(cards: DigimonCard[], format: DeckFormat): DigimonCard[] {
  if (format === 'paper') return cards.filter((card) => !ALYSION_ONLY_SET.test(setOf(card.cardNumber)));
  return cards
    .filter(isInAlysionPool)
    .map((card) => ({ ...card, restrictions: { ...card.restrictions, english: restrictionFor(card, format) } }));
}
