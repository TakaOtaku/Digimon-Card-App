import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {selectSite} from "../../store/digimon.selectors";

export enum SITES {
  'Collection',
  'Decks',
  'DeckBuilder'
}

@Component({
  selector: 'digimon-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  SITES = SITES;
  site: number = SITES.Collection;

  private destroy$ = new Subject();

  constructor(
    public store: Store
  ) {}

  ngOnInit() {
    this.store.select(selectSite).pipe(takeUntil(this.destroy$))
      .subscribe(site => this.site = site);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
