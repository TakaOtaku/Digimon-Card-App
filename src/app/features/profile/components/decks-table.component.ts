import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, signal } from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { IDeck } from '../../../../models';
import { setDeckImage } from '../../../functions/digimon-card.functions';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { SaveStore } from '../../../store/save.store';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'digimon-decks-table',
  template: `
    <div class="flex w-full flex-col gap-2">
      @for (group of groups(); track group.color) {
        <section class="overflow-hidden rounded-xl border border-line bg-ink-1">
          <button
            type="button"
            (click)="toggle(group.color)"
            [attr.aria-expanded]="!collapsed.has(group.color)"
            class="flex w-full items-center gap-3 px-4 py-3 text-left text-fg">
            <span class="h-4 w-4 shrink-0 rounded-full" [ngClass]="group.color"></span>
            <span class="font-semibold">{{ group.color }}</span>
            <span class="font-mono text-xs text-muted">{{ group.decks.length }} {{ group.decks.length === 1 ? 'deck' : 'decks' }}</span>
            <i class="pi ml-auto text-xs text-muted" [ngClass]="collapsed.has(group.color) ? 'pi-chevron-down' : 'pi-chevron-up'"></i>
          </button>
          @if (!collapsed.has(group.color)) {
            <ul class="m-0 list-none divide-y divide-line border-t border-line p-0">
              @for (deck of group.decks; track deck.id) {
                <li>
                  <button type="button" (click)="onDeckClick.emit(deck)" class="flex w-full items-center gap-4 px-4 py-2 text-left hover:bg-ink-2">
                    <span
                      class="hidden h-12 w-28 shrink-0 rounded-md bg-ink-2 sm:block"
                      defaultImage="assets/images/digimon-card-back.webp"
                      [lazyLoad]="getCardImage(deck)"
                      [ngStyle]="{ 'background-size': 'cover', 'background-position': 'center 25%' }"></span>
                    <span class="flex min-w-0 flex-1 flex-col">
                      <span class="truncate font-semibold text-fg">{{ deck.title || 'Untitled deck' }}</span>
                      <span class="truncate text-xs text-muted">{{ deck.description }}</span>
                    </span>
                    <span class="hidden flex-wrap gap-1 md:flex">
                      @for (tag of deck.tags; track tag.name) {
                        <span class="rounded-full border border-line bg-ink-2 px-2 py-0.5 font-mono text-[11px] text-fg">{{ tag.name }}</span>
                      }
                    </span>
                    <span class="w-16 text-right font-mono text-xs text-muted">{{ cardCount(deck) }} cards</span>
                    <span class="hidden w-16 text-right font-mono text-xs text-muted sm:block">{{ deck.date | date: 'dd.MM.yy' }}</span>
                  </button>
                </li>
              }
            </ul>
          }
        </section>
      }
    </div>
  `,
  standalone: true,
  imports: [NgClass, LazyLoadImageModule, NgStyle, DatePipe],
})
export class DecksTableComponent implements OnChanges {
  @Input() decks: IDeck[];
  groups = signal<{ color: string; decks: IDeck[] }[]>([]);
  collapsed = new Set<string>();

  ngOnChanges() {
    const byColor = new Map<string, IDeck[]>();
    [...(this.decks ?? [])]
      .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
      .forEach((deck) => {
        const color = deck?.color?.name || 'Other';
        byColor.set(color, [...(byColor.get(color) ?? []), deck]);
      });
    const order = ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Purple', 'White', 'Multi', 'Other'];
    this.groups.set([...byColor.entries()].sort(([a], [b]) => order.indexOf(a) - order.indexOf(b)).map(([color, decks]) => ({ color, decks })));
  }

  toggle(color: string) {
    this.collapsed.has(color) ? this.collapsed.delete(color) : this.collapsed.add(color);
  }

  cardCount(deck: IDeck): number {
    return (deck.cards ?? []).reduce((sum, card) => sum + card.count, 0);
  }
  @Output() onDeckClick = new EventEmitter<IDeck>();

  saveStore = inject(SaveStore);
  digimonCardStore = inject(DigimonCardStore);

  getCardImage(deck: IDeck): string {
    //If there are no cards in the deck set it to the Yokomon
    if (!deck.cards || deck.cards.length === 0 || this.digimonCardStore.cards().length === 0) {
      return `${environment.cardImageBaseUrl}BT1-001.webp`;
    }

    // If there is a ImageCardId set it
    if (deck.imageCardId) {
      return this.digimonCardStore.cardsMap().get(deck.imageCardId)?.cardImage ?? `${environment.cardImageBaseUrl}BT1-001.webp`;
    } else {
      const deckImage = setDeckImage(deck, this.digimonCardStore.cards());
      this.saveStore.saveDeck({ ...deck, imageCardId: deckImage.id });

      return deckImage.cardImage;
    }
  }

}
