import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { emptySave } from '@models';
import { setCompletion } from '@functions';
import { MongoBackendService } from '@services';
import { DigimonCardStore, SaveStore } from '@store';
import { PageComponent } from '../shared/page.component';
import { PaginationCardListComponent } from './components/pagination-card-list.component';

@Component({
  selector: 'digimon-collection-page',
  template: `
    @if (urlCollection(); as collection) {
      <digimon-page>
        <digimon-pagination-card-list
          [collectionOnly]="true"
          [inputCollection]="collection"
          class="w-screen flex flex-row h-[calc(100vh-7.5rem)] md:h-[calc(100vh-5rem)]">
          <section aria-label="Set completion" class="w-full flex gap-2 overflow-x-auto px-1 pt-1 pb-2">
            @for (set of sets(); track set.set) {
              <div class="shrink-0 w-32 rounded-lg border border-line bg-ink-1 p-3 flex flex-col gap-2">
                <div class="flex justify-between font-mono text-sm">
                  <span class="font-semibold text-fg">{{ set.set }}</span>
                  <span class="text-muted">{{ set.percent }}%</span>
                </div>
                <div class="h-1.5 rounded bg-line overflow-hidden">
                  <div class="h-full bg-accent" [style.width.%]="set.percent"></div>
                </div>
                <span class="font-mono text-xs text-muted">{{ set.owned }} / {{ set.total }}</span>
              </div>
            }
          </section>
        </digimon-pagination-card-list>
      </digimon-page>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PaginationCardListComponent, PageComponent],
})
export class CollectionPageComponent {
  meta = inject(Meta);
  title = inject(Title);

  private mongoBackendService = inject(MongoBackendService);
  private route = inject(ActivatedRoute);

  // Check the URL if another Save should be loaded
  checkUrl$ = this.route.params.pipe(
    switchMap((params) => {
      if (params['userId']) {
        return this.mongoBackendService.getSave(params['userId']);
      } else {
        return of(emptySave);
      }
    }),
    map((save) => save.collection),
  );
  urlCollection = toSignal(this.checkUrl$);

  private digimonCardStore = inject(DigimonCardStore);
  private saveStore = inject(SaveStore);

  sets = computed(() => {
    const own = !this.route.snapshot.params['userId'];
    const collection = own ? this.saveStore.collection() : (this.urlCollection() ?? []);
    return setCompletion(this.digimonCardStore.cards(), collection, this.saveStore.settings().collectionMinimum).map((set) => ({
      ...set,
      percent: Math.round((set.owned / set.total) * 100),
    }));
  });

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
