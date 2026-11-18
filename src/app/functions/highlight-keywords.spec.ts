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

  it('colors Hand pink like the cards do', () => {
    expect(highlightKeywords('{Hand}')).toBe('<span class="kw kw-hand">{Hand}</span>');
    expect(highlightKeywords('{Trash}')).toBe('<span class="kw kw-hand">{Trash}</span>');
    expect(highlightKeywords('{Breeding}')).toBe('<span class="kw kw-hand">{Breeding}</span>');
    expect(highlightKeywords('{Security}')).toBe('<span class="kw kw-hand">{Security}</span>');  
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
    expect(highlightKeywords('{Hand} x')).toContain('kw kw-hand');
    expect(highlightKeywords('[Counter] x')).toContain('kw kw-bracket');
    expect(highlightKeywords('{Trash} x')).toContain('kw kw-hand');
    expect(highlightKeywords('[Arts Digivolve] x')).toContain('kw kw-assembly');
    expect(highlightKeywords('[Link] [Appmon] trait')).toContain('<span class="kw kw-assembly">[Link]</span>');
    expect(highlightKeywords('[Twice Per Turn] x')).toContain('kw kw-once');
    expect(highlightKeywords('Overflow ＜-3＞ (lose 3 memory.)')).toContain('kw-overflow');
  });

  it.each(['Hand', 'Trash', 'Security', 'Breeding'])('colors {%s} as a location badge', (zone) => {
    expect(highlightKeywords(`{${zone}} [Your Turn]`)).toBe(
      `<span class="kw kw-hand">{${zone}}</span> <span class="kw kw-bracket">[Your Turn]</span>`,
    );
  });

  it.each(['All Turns', 'Your Turn', "Opponent's Turn", 'End of Your Turn', "End of Opponent's Turn", 'End of All Turns'])(
    'colors both Security and %s pink with or without a space',
    (timing) => {
      for (const separator of ['', ' ']) {
        const html = highlightKeywords(`[Security]${separator}[${timing}]`);
        expect(html).toBe(
          `<span class="kw kw-hand">[Security]</span>${separator}<span class="kw kw-hand${timing.length + 2 > 22 ? ' kw-long' : ''}">[${timing}]</span>`,
        );
      }
    },
  );

  it.each(['On Deletion', 'When Digivolving', 'On Play'])('keeps Security and %s blue', (timing) => {
    for (const separator of ['', ' ']) {
      expect(highlightKeywords(`[Security]${separator}[${timing}]`)).toBe(
        `<span class="kw kw-bracket">[Security]</span>${separator}<span class="kw kw-bracket">[${timing}]</span>`,
      );
    }
  });

  it('does not recolor unrelated or separated Security keywords', () => {
    expect(highlightKeywords('[Security] text [Your Turn]')).toBe(
      '<span class="kw kw-bracket">[Security]</span> text <span class="kw kw-bracket">[Your Turn]</span>',
    );
    expect(highlightKeywords('[Security]\n[Your Turn]')).toContain('<span class="kw kw-bracket">[Security]</span>');
    expect(highlightKeywords('＜[Security] [Your Turn]＞')).toBe('<span class="kw kw-angle kw-long">＜[Security] [Your Turn]＞</span>');
    expect(highlightKeywords('"{Trash} <script>"')).toBe('<em>"<span class="kw kw-hand">{Trash}</span> &lt;script&gt;"</em>');
  });

  it('colors the names of card colors outside brackets only', () => {
    const html = highlightKeywords('Delete 1 red, green or white Digimon with [Blue Flare] in its text.');
    expect(html).toContain('<span class="kc kc-red">red</span>');
    expect(html).toContain('<span class="kc kc-green">green</span>');
    expect(html).toContain('<span class="kc kc-white">white</span>');
    expect(html).not.toContain('kc-blue');
    expect(html).toContain('[Blue Flare]');
  });

  it('colors capitalised colors in requirements and token descriptions', () => {
    expect(highlightKeywords('[DNA Digivolve] Blue Lv.4 + Green Lv.4 : Cost 0')).toContain('<span class="kc kc-blue">Blue</span>');
    expect(highlightKeywords('Token (Digimon/Red/6000 DP/＜Rush＞)')).toContain('<span class="kc kc-red">Red</span>');
  });

  it('italicises text in quotation marks, keywords inside included', () => {
    expect(highlightKeywords('gains "[On Deletion] draw 1." for the turn')).toBe(
      'gains <em>"<span class="kw kw-bracket">[On Deletion]</span> draw 1."</em> for the turn',
    );
    expect(highlightKeywords('He said “hello” twice')).toBe('He said <em>“hello”</em> twice');
  });

  it('leaves plain text alone', () => {
    expect(highlightKeywords('Gain 1 memory.')).toBe('Gain 1 memory.');
  });
});
