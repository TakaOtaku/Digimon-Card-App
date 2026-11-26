import { TestBed } from '@angular/core/testing';
import { CARDSET } from '../../models';
import { DigimonCardStore } from './digimon-card.store';

const raw = (id: string) => ({ id, cardNumber: id, cardImage: '', name: { japanese: 'x' }, restrictions: { english: 'Unrestricted' } });

describe('DigimonCardStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    jest
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (url) => {
        const cards = String(url).includes('Alysion') ? [raw('BD01-02')] : [raw('BT1-010'), raw('BT5-001')];
        return { ok: true, json: async () => cards } as Response;
      });
  });
  afterEach(() => jest.restoreAllMocks());

  it('keeps the Alysion pool when the card language changes, and the full list for lookups', async () => {
    const store = TestBed.inject(DigimonCardStore);
    store.updateFormat('alysion');
    for (const cardset of [CARDSET.English, CARDSET.Japanese]) {
      await store.updateCards(cardset);
      expect(store.poolCards().map((c) => c.id)).toEqual(['BT1-010', 'BD01-02']);
      expect(store.cards().length).toBe(3);
      expect(store.cardsMap().size).toBe(3);
    }
  });

  it('starts in paper', async () => {
    const store = TestBed.inject(DigimonCardStore);
    await store.updateCards(CARDSET.English);
    expect(store.poolCards().map((c) => c.id)).toEqual(['BT1-010', 'BT5-001', 'BD01-02']);
  });
});
