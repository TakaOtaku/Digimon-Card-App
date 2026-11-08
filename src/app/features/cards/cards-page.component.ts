import { SeoService } from '@services';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DigimonCard } from '@models';
import { DialogStore, SaveStore } from '@store';
import { PaginationCardListComponent } from '../collection/components/pagination-card-list.component';
import { PageComponent } from '../shared/page.component';
import { CardDetailPanelComponent } from './card-detail-panel.component';

@Component({
  selector: 'digimon-cards-page',
  template: `
    <digimon-page>
      <h1 class="sr-only">Card search</h1>
      <div class="flex w-screen h-[calc(var(--app-vh)-7.5rem)] md:h-[calc(var(--app-vh)-5rem)]">
        <!-- collectionOnly: a click shows the card instead of adding it to a deck -->
        <digimon-pagination-card-list
          [collectionOnly]="true"
          [dialogOnView]="false"
          [showCollectionMode]="false"
          (cardViewed)="select($event)"
          class="flex flex-row flex-1 min-w-0 h-full"></digimon-pagination-card-list>
        @if (preview() !== 'dialog') {
          <aside
            aria-label="Card details"
            class="hidden xl:block w-[22rem] shrink-0 overflow-y-auto border-line bg-ink-1 p-4"
            [class]="preview() === 'left' ? 'order-first border-r' : 'border-l'">
            <digimon-card-detail-panel [card]="selected()"></digimon-card-detail-panel>
            <p class="mt-6 text-xs text-muted">Card data from the <a class="text-accent hover:underline" href="https://digimoncardgame.fandom.com" target="_blank" rel="noopener">Digimon Card Game Fandom wiki</a>.</p>
          </aside>
        }
      </div>
    </digimon-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PaginationCardListComponent, PageComponent, CardDetailPanelComponent],
})
export class CardsPageComponent {
  private seo = inject(SeoService);
  private dialogStore = inject(DialogStore);
  private saveStore = inject(SaveStore);
  selected = signal<DigimonCard | null>(null);
  preview = computed(() => this.saveStore.settings().cardPreview ?? 'right');

  constructor() {
    this.seo.set('Card search', 'Search every Digimon Card Game card by name, number, color, level, set and effect, with rulings and prices.');
  }

  // The side panel only exists on xl screens, and not at all when the setting says dialog
  select(card: DigimonCard) {
    this.selected.set(card);
    if (this.preview() === 'dialog' || !window.matchMedia('(min-width: 1280px)').matches) {
      this.dialogStore.updateViewCardDialog({ show: true, card, width: '50vw' });
    }
  }
}
