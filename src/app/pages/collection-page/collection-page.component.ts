import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectMobileCollectionView } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-collection-page',
  templateUrl: './collection-page.component.html',
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
