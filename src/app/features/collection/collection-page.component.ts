import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CardListComponent } from './components/card-list.component';
import { FilterAndSearchComponent } from '../shared/filter/filter-and-search.component';
import { CollectionViewComponent } from './components/collection-view.component';

@Component({
  selector: 'digimon-collection-page',
  template: `
    <div
      class="flex flex-col min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-5rem)] lg:min-h-[100vh] w-[100vw] lg:w-[calc(100vw-6.5rem)]
      overflow-y-scroll bg-gradient-to-b from-[#17212f] to-[#08528d]">
      <digimon-collection-view
        [collectionOnly]="true"></digimon-collection-view>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CollectionViewComponent,
    FilterAndSearchComponent,
    CardListComponent,
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
