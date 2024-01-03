import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { DigimonBackendService } from '../../services/digimon-backend.service';
import { emptySave } from '../../store/reducers/save.reducer';
import { FilterAndSearchComponent } from '../shared/filter/filter-and-search.component';
import { PageComponent } from '../shared/page.component';
import { CardListComponent } from './components/card-list.component';
import { PaginationCardListComponent } from './components/pagination-card-list.component';

@Component({
  selector: 'digimon-collection-page',
  template: `
    <digimon-page *ngIf="checkUrl$ | async as collection">
      <digimon-pagination-card-list
        [collectionOnly]="true"
        [inputCollection]="collection"
        class="w-screen lg:w-[calc(100vw-6.5rem)]"></digimon-pagination-card-list>
    </digimon-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FilterAndSearchComponent,
    CardListComponent,
    PaginationCardListComponent,
    PageComponent,
    AsyncPipe,
    NgIf,
  ],
})
export class CollectionPageComponent implements OnInit {
  meta = inject(Meta);
  title = inject(Title);

  private digimonBackendService = inject(DigimonBackendService);
  private route = inject(ActivatedRoute);

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
