import { missingCards } from './digimon-card.functions';

const card = (cardNumber: string, count: number) => ({ id: cardNumber, cardNumber, count }) as any;

describe('missingCards', () => {
  it('counts owned copies across printings and Japanese ids', () => {
    const result = missingCards(
      [card('BT1-010', 4), card('BT1-011', 2), card('BT1-012', 1)],
      [
        { id: 'BT1-010', count: 1 },
        { id: 'BT1-010_P1', count: 1 },
        { id: 'BT1-011-J', count: 2 },
      ],
    );
    expect(result.map((m) => [m.card.cardNumber, m.need])).toEqual([
      ['BT1-010', 2],
      ['BT1-012', 1],
    ]);
  });
});
