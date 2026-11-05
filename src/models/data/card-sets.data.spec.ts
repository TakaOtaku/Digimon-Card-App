import { CARD_SETS, GroupedSets, ReleaseOrder, TAGS } from './card-sets.data';
import { RarityAbbreviationMap } from './filter.data';

describe('card-sets data', () => {
  it('includes the newest set BT26 (restored during the main merge)', () => {
    expect(CARD_SETS.some((s) => s.name === 'BT26')).toBe(true);
    expect(ReleaseOrder).toContain('BT26');
    expect(TAGS).toContain('BT26');
  });

  it('lists the sets that were missing: BT27, EX14, ST25, ST26 and the Alysion products', () => {
    for (const name of ['BT27', 'EX14', 'ST25', 'ST26']) {
      expect(ReleaseOrder).toContain(name);
    }
    const alysion = GroupedSets.find((group) => group.value === 'alysion');
    expect(alysion?.items.map((item) => item.value)).toEqual(['BD01', 'BD02', 'BD03', 'ED01', 'ED02', 'SD01', 'SD02']);
    const starters = GroupedSets.find((group) => group.value === 'starter');
    expect(starters?.items.map((item) => item.value)).toEqual(expect.arrayContaining(['ST25', 'ST26']));
  });

  it('derives ReleaseOrder and TAGS from CARD_SETS', () => {
    expect(ReleaseOrder.length).toBe(CARD_SETS.length);
    // Every derived tag corresponds to a known set name.
    const names = new Set(CARD_SETS.map((s) => s.name));
    for (const tag of TAGS) {
      expect(names.has(tag)).toBe(true);
    }
  });
});

describe('RarityAbbreviationMap (restored during the main merge)', () => {
  it('maps rarity names to their abbreviations', () => {
    expect(RarityAbbreviationMap.get('Common')).toBe('C');
    expect(RarityAbbreviationMap.get('Uncommon')).toBe('U');
    expect(RarityAbbreviationMap.get('Rare')).toBe('R');
    expect(RarityAbbreviationMap.get('Super Rare')).toBe('SR');
    expect(RarityAbbreviationMap.get('Ultimate Rare')).toBe('UR');
    expect(RarityAbbreviationMap.get('Secret Rare')).toBe('SEC');
    expect(RarityAbbreviationMap.get('Promo')).toBe('P');
  });
});
