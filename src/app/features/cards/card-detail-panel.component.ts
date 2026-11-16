import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ImgFallbackDirective } from '@directives';
import { formatId, isOptionType, highlightKeywords } from '@functions';
import { DigimonCard } from '@models';
import { DialogStore } from '@store';

// Wiki data uses '-' for "no value"
const filled = (value?: string) => !!value && value.trim() !== '-' && value.trim() !== '';

const CARD_COLORS = ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Purple', 'White'];
// "Red/Black" gives ['Red', 'Black']; anything that is not a card color gives no dots
// How strongly each card color tints a stat tile over the panel color (light colors need less, so white text stays readable)
const TINT: Record<string, { hex: string; percent: number; border: string }> = {
  Red: { hex: '#e5484d', percent: 45, border: '#e5484d' },
  Blue: { hex: '#3e9bff', percent: 45, border: '#3e9bff' },
  Yellow: { hex: '#f5c518', percent: 40, border: '#f5c518' },
  Green: { hex: '#2fb67c', percent: 45, border: '#2fb67c' },
  Black: { hex: '#000000', percent: 65, border: '#808080' },
  Purple: { hex: '#8d6fdb', percent: 45, border: '#8d6fdb' },
  White: { hex: '#ffffff', percent: 28, border: '#e6edf7' },
};
const tintOf = (color: string) => `color-mix(in srgb, ${TINT[color].hex} ${TINT[color].percent}%, var(--dc-ink-2))`;

// Background and border of a stat tile for one or more card colors (several colors give a gradient)
const tileStyle = (colors: string[]): Record<string, string> => {
  if (!colors.length) return {};
  const background = colors.length === 1 ? tintOf(colors[0]) : `linear-gradient(90deg, ${colors.map(tintOf).join(', ')})`;
  return { background, 'border-color': TINT[colors[0]].border };
};

const colorsOf = (value?: string) =>
  (value ?? '')
    .split(/[/,&]/)
    .map((c) => c.trim())
    .filter((c) => CARD_COLORS.includes(c));

@Component({
  selector: 'digimon-card-detail-panel',
  template: `
    @if (card(); as card) {
      <div class="flex flex-col gap-4">
        <img [digimonImgFallback]="card.cardImage" [alt]="card.cardNumber + ' ' + card.name.english" class="w-full rounded-xl" />

        <div class="flex flex-col gap-1">
          <div class="flex items-start justify-between gap-2">
            <h2 class="m-0 font-display text-2xl font-bold text-fg">{{ card.name.english }}</h2>
            <a
              [href]="'https://digimoncardgame.fandom.com/wiki/' + formatId(card.cardNumber)"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View card on wiki"
              title="View card on wiki"
              class="shrink-0 p-1 text-accent hover:underline"
              ><i class="pi pi-external-link" aria-hidden="true"></i
            ></a>
          </div>
          <span class="font-mono text-sm text-muted">{{ subtitle() }}</span>
        </div>

        <div class="flex flex-wrap gap-1.5">
          @for (chip of chips(); track chip.text) {
            <span class="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink-2 px-2.5 py-0.5 text-xs text-fg">
              @for (color of chip.colors; track color) {
                <span class="h-2.5 w-2.5 rounded-full border border-white/30" [ngClass]="color" [title]="color"></span>
              }
              {{ chip.text }}
            </span>
          }
        </div>

        @if (stats().length) {
          <dl class="m-0 grid grid-cols-2 gap-2">
            @for (stat of stats(); track stat.label) {
              <div class="rounded-lg border px-3 py-2" [ngClass]="stat.colors.length ? '' : 'border-transparent bg-ink-2'" [style]="stat.style" [title]="stat.colors.join(' / ')">
                <dt class="text-[11px] uppercase tracking-wider" [ngClass]="stat.colors.length ? 'text-fg' : 'text-muted'">{{ stat.label }}</dt>
                <dd class="m-0 font-mono text-sm font-semibold text-fg">{{ stat.value }}</dd>
              </div>
            }
          </dl>
        }

        @for (effect of effects(); track effect.label) {
          <section class="flex flex-col gap-1">
            <h3 class="m-0 text-[11px] font-semibold uppercase tracking-wider text-muted">{{ effect.label }}</h3>
            <p class="m-0 whitespace-pre-wrap rounded-lg bg-ink-2 p-3 text-sm leading-relaxed text-fg" [innerHTML]="effect.html"></p>
          </section>
        }

        <button type="button" (click)="openDialog(card)" class="self-start text-sm text-accent hover:underline">Full details, rulings and prices</button>
      </div>
    } @else {
      <p class="m-0 text-sm text-muted">Select a card to see its details.</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ImgFallbackDirective, NgClass],
})
export class CardDetailPanelComponent {
  card = input<DigimonCard | null>(null);
  protected readonly formatId = formatId;

  private dialogStore = inject(DialogStore);


  subtitle = computed(() => {
    const card = this.card()!;
    return [card.cardNumber, card.cardType, filled(card.cardLv) ? card.cardLv : ''].filter(Boolean).join(' · ');
  });

  chips = computed(() => {
    const card = this.card()!;
    return [card.color, card.form, card.attribute, card.type, card.rarity]
      .filter(filled)
      .map((text) => ({ text, colors: text === card.color ? colorsOf(text) : [] }));
  });

  stats = computed(() => {
    const card = this.card()!;
    const stats: { label: string; value: string; colors: string[] }[] = [
      // Options and Dual (Digimon/Option) cards are used, not played: same rule as the full card dialog
      { label: isOptionType(card.cardType) ? 'Use cost' : 'Play cost', value: card.playCost, colors: [] },
      { label: 'DP', value: card.dp, colors: [] },
      { label: 'Link DP', value: card.linkDP, colors: [] },
      { label: 'Option color req.', value: card.optionCardColourRequirement, colors: colorsOf(card.optionCardColourRequirement) },
      // The color of the Digimon it digivolves from tints the tile instead of showing as a word
      ...(card.digivolveCondition ?? []).map((c) => {
        const colors = colorsOf(c.color);
        return { label: `From Lv.${c.level}${colors.length ? '' : ' ' + c.color}`.trim(), value: c.cost, colors };
      }),
    ];
    return stats.filter((s) => filled(s.value)).map((s) => ({ ...s, style: tileStyle(s.colors) }));
  });

  effects = computed(() => {
    const card = this.card()!;
    // Same fields and order as the full card dialog
    return [
      { label: 'Special Digivolve', text: card.specialDigivolve },
      { label: 'DNA Digivolve', text: card.dnaDigivolve },
      { label: 'DigiXros', text: card.digiXros },
      { label: 'Assembly', text: card.assembly },
      { label: 'Burst Digivolve', text: card.burstDigivolve },
      { label: 'ACE', text: card.aceEffect },
      { label: 'Rule', text: card.rule },
      { label: 'Effect', text: card.effect },
      { label: 'Dual effect', text: card.dualEffect },
      { label: 'Option card effect', text: card.optionCardEffect },
      { label: 'Inherited effect', text: card.digivolveEffect },
      { label: 'Security effect', text: card.securityEffect },
      { label: 'Link requirement', text: card.linkRequirement },
      { label: 'Link effect', text: card.linkEffect },
    ]
      .filter((e) => filled(e.text))
      .map((e) => ({ label: e.label, html: highlightKeywords(e.text) }));
  });



  openDialog(card: DigimonCard) {
    this.dialogStore.updateViewCardDialog({ show: true, card, width: '50vw' });
  }
}
