import { emptyDeck, IDeck } from '@models';
import * as uuid from 'uuid';

export * from './upload-adapter';
export function checkDeckErrors(decks: IDeck[]) {
  const newDecks: IDeck[] = decks.map((deck) => {
    const newDeck = { ...emptyDeck };
    newDeck.id = deck.id ?? uuid.v4();
    newDeck.cards = deck.cards ?? [];
    newDeck.sideDeck = deck.sideDeck ?? [];
    newDeck.color = deck.color ?? { name: 'White', img: 'assets/images/decks/white.svg' };
    newDeck.title = deck.title ?? '';
    newDeck.description = deck.description ?? '';
    newDeck.tags = deck.tags ?? [];
    newDeck.date = deck.date ?? new Date().toString();
    newDeck.user = deck.user ?? '';
    newDeck.userId = deck.userId ?? '';
    newDeck.imageCardId = deck.imageCardId ?? 'BT1-001';
    newDeck.photoUrl = deck.photoUrl ?? '';
    newDeck.likes = deck.likes ?? [];
    return newDeck;
  });
  return newDecks;
}
