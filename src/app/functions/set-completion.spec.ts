import { setCompletion } from './digimon-card.functions';

const card = (id: string, version = 'Normal') => ({ id, version }) as any;
const settings = (overrides = {}) => ({ collectionMinimum: 1, aaCollectionMinimum: 0, collectionSets: [] as string[], playsetTracking: false, unlimitedCollectionMinimum: 4, ...overrides });

describe('setCompletion', () => {
  const cards = [card('BT1-001'), card('BT1-002'), card('BT1-002_P1', 'Alternative Art'), card('BT1-003-J'), card('EX13-001'), card('EX13-002')];
  const collection = [
    { id: 'BT1-001', count: 1 },
    { id: 'BT1-002_P1', count: 1 },
    { id: 'BT1-003', count: 4 },
    { id: 'EX13-002', count: 4 },
  ];
  const playsetCards = [
    card('BT1-001'),
    card('BT1-001_P1', 'Alternative Art'),
    card('BT1-001_P2', 'Alternative Art'),
    card('BT2-001_P1', 'Alternative Art'),
    card('BT2-001_P2', 'Alternative Art'),
    card('BT3-001'),
    card('BT4-001'),
    card('BT5-001'),
    card('BT6-085')
  ];
  const playsetCollection = [
    { id: 'BT1-001', count: 2 },
    { id: 'BT1-001_P1', count: 1 },
    { id: 'BT1-001_P2', count: 1 },
    { id: 'BT2-001_P1', count: 2 },
    { id: 'BT2-001_P2', count: 2 },
    { id: 'BT3-001', count: 3 },
    { id: 'BT4-001', count: 1 },
    { id: 'BT5-001', count: 1 },
    { id: 'BT6-085', count: 3 }
  ]
  const bannedCards = [{ ...card('BT4-001'), restrictions: { english: 'Banned' } }];
  const restrictedCards = [{ ...card('BT5-001'), restrictions: { english: 'Restricted to 1' } }]
  const unlimitedCards = [{ ...card('BT6-085'), cardNumber: 'BT6-085' }];

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

  it('combines normal and alt-art copies for playset tracking', () => {
    expect(setCompletion(playsetCards, playsetCollection, settings({ playsetTracking: true })).find((s) => s.set === 'BT1')!.owned).toBe(1);
  });

  it('counts multiple alternate-art printings together for playset tracking', () => {
    expect(setCompletion(playsetCards, playsetCollection, settings({ playsetTracking: true })).find((s) => s.set === 'BT2')!.owned).toBe(1);
  });

  it('requires four copies for normal cards for playset tracking', () => {
    expect(setCompletion(playsetCards, playsetCollection, settings({ collectionMinimum: 1, playsetTracking: true })).find((s) => s.set === 'BT3')!.owned).toBe(0);
  });

  it('uses one copy for banned cards for playset tracking', () => {
    expect(setCompletion(bannedCards, playsetCollection, settings({ playsetTracking: true })).find((s) => s.set === 'BT4')!.owned).toBe(1);
  });

  it('uses one copy for restricted cards for playset tracking', () => {
    expect(setCompletion(restrictedCards, playsetCollection, settings({ playsetTracking: true })).find((s) => s.set === 'BT5')!.owned).toBe(1);
  });

  it('uses the unlimited card setting for playset tracking', () => {
    expect(setCompletion(unlimitedCards, playsetCollection, settings({ playsetTracking: true, unlimitedCollectionMinimum: 3 })).find((s) => s.set === 'BT6')!.owned).toBe(1)
  });
});
