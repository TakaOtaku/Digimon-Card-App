import { deckGroups, groupDeckCards } from './digimon-card.functions';

const card = (id: string, cardType: string, count: number) => ({ id, cardType, count }) as any;

describe('groupDeckCards', () => {
  const cards = [
    card('O1', 'Option', 2),
    card('D4', 'Digimon', 4),
    card('T1', 'Tamer', 3),
    card('D3', 'Digimon', 4),
    card('E1', 'Digi-Egg', 4),
    card('DO', 'Digimon/Option', 1),
  ];

  it('makes four groups in play order, keeping the deck order inside each', () => {
    expect(groupDeckCards(cards).map((g) => [g.title, g.count, g.cards.map((c) => c.id)])).toEqual([
      ['Digi-Egg', 4, ['E1']],
      ['Digimon', 9, ['D4', 'D3', 'DO']],
      ['Tamer', 3, ['T1']],
      ['Option', 2, ['O1']],
    ]);
  });

  it('returns one untitled group when grouping is off', () => {
    expect(deckGroups(cards, false).map((g) => [g.title, g.count, g.cards.length])).toEqual([['', 18, 6]]);
    expect(deckGroups([], false)).toEqual([]);
  });
});
