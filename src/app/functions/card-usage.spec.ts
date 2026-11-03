import { cardUsage } from './digimon-card.functions';

const card = (id: string, cardNumber = id) => ({ id, cardNumber, name: { english: id } }) as any;
const deck = (...cards: [string, number][]) => ({ cards: cards.map(([id, count]) => ({ id, count })) }) as any;

describe('cardUsage', () => {
  const all = [card('BT1-010'), card('BT1-010_P1', 'BT1-010'), card('BT1-01', 'BT1-01'), card('ST1-01')];

  it('merges printings, counts decks once and keeps the top card', () => {
    const rows = cardUsage([deck(['BT1-010', 2], ['BT1-010_P1', 2]), deck(['BT1-010', 3], ['BT1-01', 4]), deck(['ST01-01', 1])], all);
    expect(rows.map((r) => [r.card.cardNumber, r.decks, r.copies, Math.round(r.percent), r.average])).toEqual([
      ['BT1-010', 2, 7, 67, 3.5],
      ['BT1-01', 1, 4, 33, 4],
      ['ST1-01', 1, 1, 33, 1],
    ]);
  });

  it('shows the regular printing for alternate-art entries', () => {
    expect(cardUsage([deck(['BT1-010_P1', 1])], all)[0].card.id).toBe('BT1-010');
  });
});
