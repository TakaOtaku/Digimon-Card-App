import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DigimonCard } from '@models';
import { DialogStore } from '@store';
import { PaginationCardListComponent } from '../collection/components/pagination-card-list.component';
import { PageComponent } from '../shared/page.component';
import { CardDetailPanelComponent } from './card-detail-panel.component';

@Component({
  selector: 'digimon-cards-page',
  template: `
    <digimon-page>
      <div class="flex w-screen h-[calc(100vh-7.5rem)] md:h-[calc(100vh-5rem)]">
        <!-- collectionOnly: a click shows the card instead of adding it to a deck -->
        <digimon-pagination-card-list
          [collectionOnly]="true"
          [dialogOnView]="false"
          [showCollectionMode]="false"
          (cardViewed)="select($event)"
          class="flex flex-row flex-1 min-w-0 h-full"></digimon-pagination-card-list>
        <aside aria-label="Card details" class="hidden xl:block w-[22rem] shrink-0 overflow-y-auto border-l border-line bg-ink-1 p-4">
          <digimon-card-detail-panel [card]="selected()"></digimon-card-detail-panel>
        </aside>
      </div>
    </digimon-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PaginationCardListComponent, PageComponent, CardDetailPanelComponent],
})
export class CardsPageComponent {
  private dialogStore = inject(DialogStore);
  selected = signal<DigimonCard | null>(null);

  constructor() {
    inject(Title).setTitle('Digimon Card Game - Cards');
    inject(Meta).addTags([
      {
        name: 'description',
        content: 'Search every Digimon Card Game card by name, number, color, level, set and effect.',
      },
      { name: 'author', content: 'TakaOtaku' },
      { name: 'keywords', content: 'Cards, Card Search, Database, Digimon, Card, Game' },
    ]);
  }

  // The side panel only exists on xl screens; smaller screens keep the dialog
  select(card: DigimonCard) {
    this.selected.set(card);
    if (!window.matchMedia('(min-width: 1280px)').matches) {
      this.dialogStore.updateViewCardDialog({ show: true, card, width: '50vw' });
    }
  }
}
