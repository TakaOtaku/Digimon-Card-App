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

  it('colors DigiXros green like Assembly, and Digivolve blue', () => {
    expect(highlightKeywords('[DigiXros -2] [A] x [B]')).toContain('<span class="kw kw-assembly">[DigiXros -2]</span>');
    expect(highlightKeywords('[Digivolve] Lv.5: Cost 3')).toContain('<span class="kw kw-bracket">[Digivolve]</span>');
  });

  it('finds the opponent phase timings', () => {
    expect(highlightKeywords("[Start of Opponent's Main Phase] Do it.")).toContain('kw-bracket');
  });

  it('lets long keywords wrap and keeps short ones in one piece', () => {
    expect(highlightKeywords('＜Decode (Lv.4 or lower w/[Gammamon] in text or the [VB] trait)＞')).toContain('kw kw-angle kw-long');
    expect(highlightKeywords('[On Play]')).not.toContain('kw-long');
  });

  it('colors Rule, Hand, Counter, Link, Twice Per Turn and Overflow like the cards', () => {
    expect(highlightKeywords('[Rule] Name: x')).toContain('kw kw-rule');
    expect(highlightKeywords('[Hand] x')).toContain('kw kw-hand');
    expect(highlightKeywords('[Counter] x')).toContain('kw kw-hand');
    expect(highlightKeywords('[Link] [Appmon] trait')).toContain('<span class="kw kw-assembly">[Link]</span>');
    expect(highlightKeywords('[Twice Per Turn] x')).toContain('kw kw-once');
    expect(highlightKeywords('Overflow ＜-3＞ (lose 3 memory.)')).toContain('kw-overflow');
  });

  it('colors the names of card colors outside brackets only', () => {
    const html = highlightKeywords('Delete 1 red, green or white Digimon with [Blue Flare] in its text.');
    expect(html).toContain('<span class="kc kc-red">red</span>');
    expect(html).toContain('<span class="kc kc-green">green</span>');
    expect(html).toContain('<span class="kc kc-white">white</span>');
    expect(html).not.toContain('kc-blue');
    expect(html).toContain('[Blue Flare]');
  });

  it('leaves plain text alone', () => {
    expect(highlightKeywords('Gain 1 memory.')).toBe('Gain 1 memory.');
  });
});
