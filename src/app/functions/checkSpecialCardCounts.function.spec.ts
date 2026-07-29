import { checkSpecialCardCounts } from './checkSpecialCardCounts.function';

describe('checkSpecialCardCounts', () => {
  it('caps a normal card at 4 copies', () => {
    expect(checkSpecialCardCounts({ id: 'BT1-010', count: 10 })).toBe(4);
  });

  it('leaves counts of 4 or fewer unchanged', () => {
    expect(checkSpecialCardCounts({ id: 'BT1-010', count: 3 })).toBe(3);
    expect(checkSpecialCardCounts({ id: 'BT1-010', count: 4 })).toBe(4);
  });
});
