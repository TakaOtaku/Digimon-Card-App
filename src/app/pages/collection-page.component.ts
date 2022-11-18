import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectMobileCollectionView } from '../store/digimon.selectors';

@Component({
  selector: 'digimon-collection-page',
  template: `
    <div
      class="relative hidden h-[calc(100vh-50px)] w-full flex-row overflow-hidden md:inline-flex"
    >
      <digimon-collection-view
        class="h-full max-h-full w-full overflow-hidden"
        [collectionOnly]="true"
        [deckView]="false"
      ></digimon-collection-view>
    </div>

    <div class="h-[calc(100vh-58px)] overflow-y-scroll md:hidden">
      <div class="h-full w-full">
        <digimon-filter-and-search
          [compact]="true"
          class="w-100"
        ></digimon-filter-and-search>
        <digimon-card-list [showCount]="32"></digimon-card-list>
        <div class="h-24 w-full lg:hidden"></div>
      </div>
    </div>
  `,
})
export class CollectionPageComponent implements OnInit, OnDestroy {
  mobileCollectionView = false;

  private onDestroy$ = new Subject();
  constructor(private store: Store, private meta: Meta, private title: Title) {}

  ngOnInit(): void {
    this.makeGoogleFriendly();

    this.store
      .select(selectMobileCollectionView)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (mobileCollectionView) =>
          (this.mobileCollectionView = mobileCollectionView)
      );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
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
