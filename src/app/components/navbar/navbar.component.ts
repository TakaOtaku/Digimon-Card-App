import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {SITES} from "../../pages/main-page/main-page.component";
import {changeCardSets, setSite} from "../../store/digimon.actions";
import {selectSite} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  SITES = SITES;
  mobile = false;
  site = 0;

  private onDestroy$ = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(selectSite).pipe(takeUntil(this.onDestroy$))
      .subscribe(site => this.site = site);
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  changeSite(site: number) {
    this.store.dispatch(setSite({site}));
  }
}
