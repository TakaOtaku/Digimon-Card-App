import { setCompletion } from './digimon-card.functions';

const card = (id: string, version = 'Normal') => ({ id, version }) as any;

describe('setCompletion', () => {
  const cards = [card('BT1-001'), card('BT1-002'), card('BT1-002', 'Alternative Art'), card('BT1-003-J'), card('EX13-001'), card('EX13-002')];

  it('counts unique regular printings per set, newest set first', () => {
    const result = setCompletion(cards, [{ id: 'BT1-001', count: 1 }, { id: 'BT1-003', count: 2 }, { id: 'EX13-002', count: 4 }], 1);
    expect(result).toEqual([
      { set: 'EX13', owned: 1, total: 2 },
      { set: 'BT1', owned: 2, total: 3 },
    ]);
  });

  it('applies the collection minimum', () => {
    const result = setCompletion(cards, [{ id: 'BT1-001', count: 1 }, { id: 'BT1-003', count: 4 }], 4);
    expect(result.find((s) => s.set === 'BT1')!.owned).toBe(1);
  });
});
