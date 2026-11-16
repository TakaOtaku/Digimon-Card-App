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

  it('leaves plain text alone', () => {
    expect(highlightKeywords('Gain 1 memory.')).toBe('Gain 1 memory.');
  });
});
