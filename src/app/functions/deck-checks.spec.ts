import { deckChecks } from './digimon-card.functions';

const card = (cardNumber: string, count: number, cardType = 'Digimon', restriction = 'Unrestricted') =>
  ({ cardNumber, count, cardType, name: { english: cardNumber }, restrictions: { english: restriction } }) as any;

describe('deckChecks', () => {
  it('passes a legal deck', () => {
    const cards = [card('EGG-1', 4, 'Digi-Egg'), card('EGG-2', 1, 'Digi-Egg'), ...Array.from({ length: 12 }, (_, i) => card(`C-${i}`, 4)), card('C-X', 2)];
    expect(deckChecks(cards).every((c) => c.ok)).toBe(true);
  });

  it('flags main deck size and too many eggs', () => {
    const [main, eggs] = deckChecks([card('EGG-1', 6, 'Digi-Egg'), card('C-1', 4)]);
    expect(main).toEqual({ label: 'Main deck 4/50', ok: false });
    expect(eggs).toEqual({ label: 'Digi-Eggs 6/5', ok: false });
  });

  it('sums alternate printings and applies restrictions and the 50-copy list', () => {
    const limits = deckChecks([
      card('BT1-010', 3),
      card('BT1-010', 2),
      card('R-1', 2, 'Digimon', 'Restricted to 1'),
      card('B-1', 1, 'Option', 'Banned'),
      card('BT6-085', 20),
    ])[2];
    expect(limits).toEqual({ label: 'Over copy limit: BT1-010, R-1, B-1', ok: false });
  });
});
