import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ImgFallbackDirective } from '@directives';
import { replaceWithImageTags, withoutJ } from '@functions';
import { DigimonCard } from '@models';
import { DialogStore, SaveStore, WebsiteStore } from '@store';
import { MessageService } from 'primeng/api';

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

        <div class="flex items-center gap-2">
          <button type="button" (click)="addToDeck(card)" class="h-11 flex-1 rounded-lg bg-accent font-semibold text-accent-ink">Add to deck</button>
          <button
            type="button"
            (click)="setOwned(card, owned() - 1)"
            [disabled]="owned() === 0"
            aria-label="Owned: remove one"
            class="h-11 w-11 rounded-lg border border-line bg-ink-2 text-fg disabled:opacity-40">
            −
          </button>
          <span class="min-w-[4.5rem] text-center font-mono text-sm text-fg">Owned {{ owned() }}</span>
          <button type="button" (click)="setOwned(card, owned() + 1)" aria-label="Owned: add one" class="h-11 w-11 rounded-lg border border-line bg-ink-2 text-fg">
            +
          </button>
        </div>

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

  private saveStore = inject(SaveStore);
  private websiteStore = inject(WebsiteStore);
  private dialogStore = inject(DialogStore);
  private messageService = inject(MessageService);

  owned = computed(() => {
    const card = this.card();
    if (!card) return 0;
    return this.saveStore.collection().find((c) => c.id === withoutJ(card.id))?.count ?? 0;
  });

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
      ...(card.digivolveCondition ?? []).map((c) => ({ label: `From Lv.${c.level} ${c.color}`.trim(), value: c.cost })),
    ];
    return stats.filter((s) => filled(s.value));
  });

  effects = computed(() => {
    const card = this.card()!;
    return [
      { label: 'Effect', text: card.effect },
      { label: 'Inherited effect', text: card.digivolveEffect },
      { label: 'Security effect', text: card.securityEffect },
    ]
      .filter((e) => filled(e.text))
      .map((e) => ({ label: e.label, html: replaceWithImageTags(e.text) }));
  });

  addToDeck(card: DigimonCard) {
    this.websiteStore.addCardToDeck(card.id);
    this.messageService.add({ severity: 'success', summary: 'Added to deck', detail: `${card.name.english} is in your open deck.` });
  }

  setOwned(card: DigimonCard, count: number) {
    this.saveStore.updateCard(withoutJ(card.id), Math.max(0, count));
  }

  openDialog(card: DigimonCard) {
    this.dialogStore.updateViewCardDialog({ show: true, card, width: '50vw' });
  }
}
