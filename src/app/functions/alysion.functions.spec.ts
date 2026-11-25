import { DigimonCard } from '../../models';
import { deckFormat, isAlysionSet, poolFor, restrictionFor } from './alysion.functions';

const c = (id: string, english = 'Unrestricted') => ({ id, cardNumber: id.split('_')[0], restrictions: { english } }) as DigimonCard;

describe('alysion functions', () => {
  const all = [
    c('BD01-02'),
    c('BD01-02_P1'),
    c('ED01-01'),
    c('SD01-02'),
    c('BT1-010'),
    c('BT1-010_P1'),
    c('ST6-01'),
    c('BT5-001'),
    c('ST7-01'),
    c('BT2-047'),
    c('BT1-084', 'Banned'),
  ];

  it('keeps Alysion prints and base prints of reused sets', () => {
    expect(poolFor(all, 'alysion').map((x) => x.id)).toEqual([
      'BD01-02',
      'BD01-02_P1',
      'ED01-01',
      'SD01-02',
      'BT1-010',
      'ST6-01',
      'BT2-047',
      'BT1-084',
    ]);
  });

  it('leaves out errata prints of reused cards', () => {
    expect(poolFor([c('BT2-097'), { ...c('BT2-097'), id: 'BT2-097-Errata' }], 'alysion').map((x) => x.id)).toEqual(['BT2-097']);
  });

  it('hides Alysion-only cards in paper', () => {
    expect(poolFor(all, 'paper').map((x) => x.id)).toEqual(['BT1-010', 'BT1-010_P1', 'ST6-01', 'BT5-001', 'ST7-01', 'BT2-047', 'BT1-084']);
  });

  it('applies the restriction list of the format without mutating cards', () => {
    expect(restrictionFor(c('BT2-047'), 'alysion')).toBe('Restricted to 1');
    expect(restrictionFor(c('BT1-084', 'Banned'), 'alysion')).toBe('Unrestricted');
    expect(restrictionFor(c('BT1-084', 'Banned'), 'paper')).toBe('Banned');
    expect(poolFor(all, 'alysion').find((x) => x.id === 'BT1-084')!.restrictions.english).toBe('Unrestricted');
    expect(all.find((x) => x.id === 'BT1-084')!.restrictions.english).toBe('Banned');
  });

  it('knows the sets of the pool', () => {
    expect(['BD01', 'ED02', 'SD01', 'BT1', 'ST6'].every(isAlysionSet)).toBe(true);
    expect(['BT5', 'ST7', 'EX1', 'P'].some(isAlysionSet)).toBe(false);
  });

  it('treats a deck without a format as paper', () => {
    expect(deckFormat({})).toBe('paper');
    expect(deckFormat({ format: 'alysion' })).toBe('alysion');
  });
});
