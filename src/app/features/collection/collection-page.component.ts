import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CardListComponent } from './components/card-list.component';
import { FilterAndSearchComponent } from '../shared/filter/filter-and-search.component';
import { PaginationCardListComponent } from './components/pagination-card-list.component';

@Component({
  selector: 'digimon-collection-page',
  template: `
    <digimon-pagination-card-list
      [collectionOnly]="true"
      class="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-5rem)] lg:h-[100vh]"></digimon-pagination-card-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FilterAndSearchComponent,
    CardListComponent,
    PaginationCardListComponent,
  ],
})
export class CollectionPageComponent implements OnInit {
  meta = inject(Meta);
  title = inject(Title);

  ngOnInit(): void {
    this.makeGoogleFriendly();
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Collection');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Keep track of your Collection of the new Digimon Card Game. Find missing cards, rulings, erratas and many more information easily.',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content: 'Collection, Digimon, Card, Card, Game, rulings, erratas',
      },
    ]);
  }
}
