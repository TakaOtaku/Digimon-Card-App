import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ImgFallbackDirective } from '@directives';
import { replaceWithImageTags } from '@functions';
import { DigimonCard } from '@models';
import { DialogStore } from '@store';

// Wiki data uses '-' for "no value"
const filled = (value?: string) => !!value && value.trim() !== '-' && value.trim() !== '';

@Component({
  selector: 'digimon-card-detail-panel',
  template: `
    @if (card(); as card) {
      <div class="flex flex-col gap-4">
        <img [digimonImgFallback]="card.cardImage" [alt]="card.cardNumber + ' ' + card.name.english" class="w-full rounded-xl" />

        <div class="flex flex-col gap-1">
          <h2 class="m-0 font-display text-2xl font-bold text-fg">{{ card.name.english }}</h2>
          <span class="font-mono text-sm text-muted">{{ subtitle() }}</span>
        </div>

        <div class="flex flex-wrap gap-1.5">
          @for (chip of chips(); track chip) {
            <span class="rounded-full border border-line bg-ink-2 px-2.5 py-0.5 text-xs text-fg">{{ chip }}</span>
          }
        </div>

        @if (stats().length) {
          <dl class="m-0 grid grid-cols-2 gap-2">
            @for (stat of stats(); track stat.label) {
              <div class="rounded-lg bg-ink-2 px-3 py-2">
                <dt class="text-[11px] uppercase tracking-wider text-muted">{{ stat.label }}</dt>
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
  imports: [ImgFallbackDirective],
})
export class CardDetailPanelComponent {
  card = input<DigimonCard | null>(null);

  private dialogStore = inject(DialogStore);


  subtitle = computed(() => {
    const card = this.card()!;
    return [card.cardNumber, card.cardType, filled(card.cardLv) ? card.cardLv : ''].filter(Boolean).join(' · ');
  });

  chips = computed(() => {
    const card = this.card()!;
    return [card.color, card.form, card.attribute, card.type, card.rarity].filter(filled);
  });

  stats = computed(() => {
    const card = this.card()!;
    const stats = [
      { label: 'Play cost', value: card.playCost },
      { label: 'DP', value: card.dp },
      { label: 'Link DP', value: card.linkDP },
      { label: 'Option color req.', value: card.optionCardColourRequirement },
      ...(card.digivolveCondition ?? []).map((c) => ({ label: `From Lv.${c.level} ${c.color}`.trim(), value: c.cost })),
    ];
    return stats.filter((s) => filled(s.value));
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
      .map((e) => ({ label: e.label, html: replaceWithImageTags(e.text) }));
  });



  openDialog(card: DigimonCard) {
    this.dialogStore.updateViewCardDialog({ show: true, card, width: '50vw' });
  }
}
