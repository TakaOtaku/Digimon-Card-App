import { setCompletion } from './digimon-card.functions';

const card = (id: string, version = 'Normal') => ({ id, version }) as any;
const settings = (overrides = {}) => ({ collectionMinimum: 1, aaCollectionMinimum: 0, collectionSets: [] as string[], ...overrides });

describe('setCompletion', () => {
  const cards = [card('BT1-001'), card('BT1-002'), card('BT1-002_P1', 'Alternative Art'), card('BT1-003-J'), card('EX13-001'), card('EX13-002')];
  const collection = [
    { id: 'BT1-001', count: 1 },
    { id: 'BT1-002_P1', count: 1 },
    { id: 'BT1-003', count: 4 },
    { id: 'EX13-002', count: 4 },
  ];

  it('counts regular printings per set, newest set first', () => {
    expect(setCompletion(cards, collection, settings())).toEqual([
      { set: 'EX13', owned: 1, total: 2 },
      { set: 'BT1', owned: 2, total: 3 },
    ]);
  });

  it('applies the collection goal', () => {
    expect(setCompletion(cards, collection, settings({ collectionMinimum: 4 })).find((s) => s.set === 'BT1')!.owned).toBe(1);
  });

  it('includes alt arts only when their goal is above 0', () => {
    expect(setCompletion(cards, collection, settings({ aaCollectionMinimum: 1 })).find((s) => s.set === 'BT1')).toEqual({ set: 'BT1', owned: 3, total: 4 });
  });

  it('tracks only the chosen sets', () => {
    expect(setCompletion(cards, collection, settings({ collectionSets: ['EX13'] })).map((s) => s.set)).toEqual(['EX13']);
  });
});
