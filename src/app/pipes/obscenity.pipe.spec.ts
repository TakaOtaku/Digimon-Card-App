import { ObscenityPipe } from './obscenity.pipe';

describe('ObscenityPipe', () => {
  const pipe = new ObscenityPipe();

  it('leaves clean text unchanged', () => {
    expect(pipe.transform('digimon card game')).toBe('digimon card game');
  });

  it('masks a profane word', () => {
    const result = pipe.transform('shit');
    expect(result).not.toBe('shit');
    expect(result).toContain('*');
  });
});
