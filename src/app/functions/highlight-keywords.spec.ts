import { highlightKeywords } from './digimon-card.functions';

describe('highlightKeywords', () => {
  it('wraps a bracket keyword in a bold span', () => {
    expect(highlightKeywords('[On Play] Draw 1 card.')).toBe('<span class="kw kw-bracket">[On Play]</span> Draw 1 card.');
  });

  it('wraps an angle keyword, also one that is not in the table', () => {
    expect(highlightKeywords('This has ＜Blocker＞.')).toContain('<span class="kw kw-angle">＜Blocker＞</span>');
    expect(highlightKeywords('＜Totally New Keyword＞')).toBe('<span class="kw kw-angle">＜Totally New Keyword＞</span>');
  });

  it('keeps a keyword with a card name inside as one span', () => {
    const html = highlightKeywords('＜Decode ([Aegiomon])＞ then draw.');
    expect(html.match(/<span/g)).toHaveLength(1);
    expect(html).toContain('＜Decode ([Aegiomon])＞</span>');
  });

  it('escapes the text around the keywords', () => {
    expect(highlightKeywords('<img src=x onerror=1> [On Play]')).toBe('&lt;img src=x onerror=1&gt; <span class="kw kw-bracket">[On Play]</span>');
  });

  it('colors Once Per Turn red like the cards do', () => {
    expect(highlightKeywords('[Once Per Turn] Draw 1.')).toContain('<span class="kw kw-once">[Once Per Turn]</span>');
  });

  it('finds Assembly written with a no-break space, for every number', () => {
    const html = highlightKeywords('[Assembly\u00a0-4] [MetalGreymon: Alterous Mode] x [Greymon]');
    expect(html).toContain('<span class="kw kw-assembly">[Assembly -4]</span>');
    expect(highlightKeywords('[Assembly\u00a0-9]')).toContain('kw-assembly');
  });

  it('colors DigiXros green like Assembly, and Digivolve orange', () => {
    expect(highlightKeywords('[DigiXros -2] [A] x [B]')).toContain('<span class="kw kw-assembly">[DigiXros -2]</span>');
    expect(highlightKeywords('[Digivolve] Lv.5: Cost 3')).toContain('<span class="kw kw-angle">[Digivolve]</span>');
  });

  it('finds the opponent phase timings', () => {
    expect(highlightKeywords("[Start of Opponent's Main Phase] Do it.")).toContain('kw-bracket');
  });

  it('leaves plain text alone', () => {
    expect(highlightKeywords('Gain 1 memory.')).toBe('Gain 1 memory.');
  });
});
