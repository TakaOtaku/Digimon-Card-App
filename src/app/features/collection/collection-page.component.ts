import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { emptySave } from '../../../models';
import { DigimonBackendService } from '../../services/digimon-backend.service';
import { FilterAndSearchComponent } from '../shared/filter/filter-and-search.component';
import { PageComponent } from '../shared/page.component';
import { PaginationCardListComponent } from './components/pagination-card-list.component';

@Component({
  selector: 'digimon-collection-page',
  template: `
    <digimon-page *ngIf="checkUrl$ | async as collection">
      <digimon-pagination-card-list
        [collectionOnly]="true"
        [inputCollection]="collection"
        class="w-screen lg:w-[calc(100vw-6.5rem)] flex flex-row h-[calc(100vh-3.5rem)] md:h-[calc(100vh-5rem)] lg:h-screen"></digimon-pagination-card-list>
    </digimon-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FilterAndSearchComponent,
    PaginationCardListComponent,
    PageComponent,
    AsyncPipe,
    NgIf,
  ],
})
export class CollectionPageComponent {
  meta = inject(Meta);
  title = inject(Title);

  private digimonBackendService = inject(DigimonBackendService);
  private route = inject(ActivatedRoute);

  // Check the URL if another Save should be loaded
  checkUrl$ = this.route.params.pipe(
    switchMap((params) => {
      if (params['userId']) {
        return this.digimonBackendService.getSave(params['userId']);
      } else {
        return of(emptySave);
      }
    }),
    map((save) => save.collection),
  );

  constructor() {
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
