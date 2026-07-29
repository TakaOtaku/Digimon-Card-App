import { CARD_SETS, ReleaseOrder, TAGS } from './card-sets.data';
import { RarityAbbreviationMap } from './filter.data';

describe('card-sets data', () => {
  it('includes the newest set BT26 (restored during the main merge)', () => {
    expect(CARD_SETS.some((s) => s.name === 'BT26')).toBe(true);
    expect(ReleaseOrder).toContain('BT26');
    expect(TAGS).toContain('BT26');
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
