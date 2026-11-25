import { emptyDeck } from '@models';
import { checkDeckErrors } from './check-deck-errors';

describe('checkDeckErrors', () => {
  it('keeps the format of every deck when a save loads', () => {
    const decks = checkDeckErrors([
      { ...emptyDeck, id: 'old' },
      { ...emptyDeck, id: 'aly', format: 'alysion' },
    ]);
    expect(decks.map((deck) => deck.format)).toEqual([undefined, 'alysion']);
  });
});
