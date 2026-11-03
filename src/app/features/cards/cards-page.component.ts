import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PaginationCardListComponent } from '../collection/components/pagination-card-list.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'digimon-cards-page',
  template: `
    <digimon-page>
      <!-- collectionOnly: a click opens the card details instead of adding to a deck -->
      <digimon-pagination-card-list
        [collectionOnly]="true"
        class="w-screen flex flex-row h-[calc(100vh-7.5rem)] md:h-[calc(100vh-5rem)]"></digimon-pagination-card-list>
    </digimon-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PaginationCardListComponent, PageComponent],
})
export class CardsPageComponent {
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
}
