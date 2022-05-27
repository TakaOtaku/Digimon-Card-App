import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { IFilter } from '../../../models';
import { changeFilter } from '../../store/digimon.actions';
import { selectFilter } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-filter-and-search',
  templateUrl: './filter-and-search.component.html',
})
export class FilterAndSearchComponent implements OnInit, OnDestroy {
  @Input() public compact = false;

  display = false;

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
      .subscribe((searchFilter) => {
        this.store.dispatch(
          changeFilter({ filter: { ...this.filter, searchFilter } })
        );
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
