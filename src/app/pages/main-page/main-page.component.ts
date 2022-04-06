import {Component, OnDestroy} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {selectSite} from "../../store/digimon.selectors";

export enum SITES {
  'Collection',
  'Decks',
  'DeckBuilder',
  'CommunityDecks'
}

@Component({
  selector: 'digimon-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent implements OnDestroy {
  SITES = SITES;
  site: number = SITES.Collection;

  mobile = false;

  private destroy$ = new Subject();

  constructor(public store: Store) {
    this.store.select(selectSite).pipe(takeUntil(this.destroy$)).subscribe(site => this.site = site);
    this.onResize();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  onResize() {
    this.mobile = window.screen.width <= 1024;
  }
}
