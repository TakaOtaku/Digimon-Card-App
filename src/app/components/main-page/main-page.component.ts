import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject} from "rxjs";
import {setSite} from "../../store/digimon.actions";

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
    this.store.dispatch(setSite({site: SITES.Collection}));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  isDeckBuilder(): string {
    return this.site === SITES.DeckBuilder ? 'half' : '';
  }
}
