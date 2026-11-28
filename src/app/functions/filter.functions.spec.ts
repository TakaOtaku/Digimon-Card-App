import { dummyCard, emptyFilter, emptySave, Forms } from '@models';
import { filterCards } from './filter.functions';

describe('Appmon form filtering', () => {
  const forms = ['Appmon', 'Stnd./Appmon', 'Sup./Appmon', 'Ult./Appmon', 'God/Appmon'];
  const cards = forms.map((form, index) => ({ ...dummyCard, id: `TEST-${index}`, form }));
  const sort = { ascOrder: true, sortBy: { name: 'ID', element: 'id' } };

  it.each(forms)('selects cards with the exact %s form', (form) => {
    expect(Forms).toContain(form);
    expect(filterCards(cards, emptySave, { ...emptyFilter, formFilter: [form] }, sort, new Map()).map((card) => card.form)).toEqual([form]);
  });
});

describe('Version filtering', () => {
  const versions = ['Normal', 'Gold Foil - Alternative Art', 'Textured - Rare Pull'];
  const cards = versions.map((version, index) => ({ ...dummyCard, id: `TEST-${index}`, version }));
  const sort = { ascOrder: true, sortBy: { name: 'ID', element: 'id' } };
  const pick = (versionFilter: string[]) =>
    filterCards(cards, emptySave, { ...emptyFilter, versionFilter }, sort, new Map()).map((card) => card.version);

  it('keeps only Normal cards when Normal is selected', () => {
    expect(pick(['Normal'])).toEqual(['Normal']);
  });

  it('ignores saved versions the filter no longer offers', () => {
    expect(pick(['Normal', 'Foil', 'Textured', 'Full Art', 'Stamp'])).toEqual(['Normal']);
  });
});

describe('keyword filter', () => {
  const card = (effect: string, digivolveEffect = '-') => ({ id: 'TEST-1', effect, digivolveEffect }) as any;
  const cards = [
    card('＜Decode ([Aegiomon])＞'),
    card('-', '＜Partition (Blue Lv.4 + Green Lv.4)＞'),
    card('＜Decoy (Black)＞'),
    card('＜Decode＞'),
  ];
  const search = (keyword: string) =>
    filterCards(
      cards,
      emptySave,
      { ...emptyFilter, keywordFilter: [keyword] },
      { ascOrder: true, sortBy: { name: 'ID', element: 'id' } },
      new Map(),
    );

  it('finds every variant of Decode and Partition', () => {
    expect(search('＜Decode＞')).toEqual(expect.arrayContaining([cards[0], cards[3]]));
    expect(search('＜Decode＞')).toHaveLength(2);
    expect(search('＜Partition＞')).toEqual([cards[1]]);
    expect(search('＜Blast DNA Digivolve＞')).toEqual([cards[1]]);
    expect(search('＜Partition＞')).toEqual([cards[1]]);
    expect(search('＜Decoy＞')).toEqual([cards[1]]);
    expect(search('＜De-Digivolve＞')).toHaveLength(3);
    expect(search('＜Detach＞')).toEqual([cards[1]]);
    expect(search('＜Digi-Burst＞')).toHaveLength(3);
    expect(search('＜Digisorption＞')).toHaveLength(3);
    expect(search('＜Draw＞')).toHaveLength(3);
    expect(search('＜Fragment＞')).toEqual([cards[1]]);
    expect(search('＜Link +＞')).toHaveLength(3);
    expect(search('＜Material Save＞')).toHaveLength(3);
    expect(search('＜Overclock＞')).toEqual([cards[1]]);
    expect(search('＜Recovery+＞')).toHaveLength(3);
    expect(search('＜Security A. +＞')).toHaveLength(3);
    expect(search('＜Security A. -＞')).toHaveLength(3);
  });
});
