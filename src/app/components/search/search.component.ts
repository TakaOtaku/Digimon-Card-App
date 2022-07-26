import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { IFilter } from '../../../models';
import { changeFilter } from '../../store/digimon.actions';
import { selectFilter } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit, OnDestroy {
  searchFilter = new FormControl('');

  private filter: IFilter;
  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectFilter)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((filter) => {
        this.filter = filter;
        this.searchFilter.setValue(filter.searchFilter, { emitEvent: false });
      });

    this.searchFilter.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((searchValue) => {
        const filter: IFilter = { ...this.filter, searchFilter: searchValue };
        this.store.dispatch(changeFilter({ filter }));
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
