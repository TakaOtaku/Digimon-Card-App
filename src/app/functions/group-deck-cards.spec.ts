import { groupDeckCards } from './digimon-card.functions';

const card = (id: string, cardType: string, cardLv: string, count: number) => ({ id, cardType, cardLv, count }) as any;

describe('groupDeckCards', () => {
  it('groups by egg, level, tamer, option in play order with counts', () => {
    const groups = groupDeckCards([
      card('O1', 'Option', '', 2),
      card('D4', 'Digimon', 'Lv.4', 4),
      card('T1', 'Tamer', '', 3),
      card('D3a', 'Digimon', 'Lv.3', 4),
      card('E1', 'Digi-Egg', 'Lv.2', 4),
      card('D3b', 'Digimon/Option', 'Lv.3', 1),
    ]);
    expect(groups.map((g) => [g.title, g.count, g.cards.map((c) => c.id)])).toEqual([
      ['Digi-Egg', 4, ['E1']],
      ['Level 3', 5, ['D3a', 'D3b']],
      ['Level 4', 4, ['D4']],
      ['Tamer', 3, ['T1']],
      ['Option', 2, ['O1']],
    ]);
  });

  it('puts level-less Digimon after the levels', () => {
    expect(groupDeckCards([card('X', 'Digimon', '-', 1), card('D6', 'Digimon', 'Lv.6', 1)]).map((g) => g.title)).toEqual(['Level 6', 'Digimon']);
  });
});
