import { ALYSION_RESTRICTED, ALYSION_REUSED_SETS } from '../../models/data/alysion.data';
import { DeckFormat, IDeck } from '../../models/interfaces/deck.interface';
import { DigimonCard } from '../../models/interfaces/digimon-card.interface';
import { ISettings } from '../../models/interfaces/settings.interface';

const ALYSION_ONLY_SET = /^(BD|ED|SD)\d+$/;
const setOf = (cardNumber: string) => cardNumber.split('-')[0];

export function deckFormat(deck: { format?: DeckFormat }): DeckFormat {
  return deck.format ?? 'paper';
}

/** True when the Alysion switch is the only difference, so settings-derived filters must stay as they are. */
export function onlyModeChanged(before: ISettings | null, after: ISettings): boolean {
  if (!before) return false;
  const rest = (settings: ISettings) => JSON.stringify({ ...settings, alysionMode: undefined });
  return rest(before) === rest(after);
}

export function isAlysionSet(set: string): boolean {
  return ALYSION_ONLY_SET.test(set) || ALYSION_REUSED_SETS.includes(set);
}

// Alysion's own cards with every print; reused paper cards only as their base print
export function isInAlysionPool(card: Pick<DigimonCard, 'id' | 'cardNumber'>): boolean {
  const set = setOf(card.cardNumber);
  return ALYSION_ONLY_SET.test(set) || (ALYSION_REUSED_SETS.includes(set) && card.id === card.cardNumber);
}

/** Alysion lists only decks whose cards are all released there, whatever the backend returns. */
export function decksForMode(decks: IDeck[], format: DeckFormat): IDeck[] {
  if (format === 'paper') return decks;
  // Saved decks may write starter sets as ST01
  const inPool = ({ id }: { id: string }) => {
    const cardId = id.replace(/^ST0/, 'ST');
    return isInAlysionPool({ id: cardId, cardNumber: cardId.split(/_P|-Errata/)[0] });
  };
  return decks.filter((deck) => deck.cards?.length > 0 && [...deck.cards, ...(deck.sideDeck ?? [])].every(inPool));
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
