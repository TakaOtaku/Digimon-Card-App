import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { IFilter } from '../../../models';
import { changeFilter } from '../../store/digimon.actions';
import { selectFilter } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-search',
  template: `
    <div class="surface-card my-2 flex flex-col px-2">
      <span
        [ngStyle]="{ display: 'inline-flex' }"
        class="p-input-icon-left w-full"
      >
        <i class="pi pi-search h-3"></i>
        <input
          [formControl]="searchFilter"
          class="h-6 w-full text-xs"
          pInputText
          placeholder="Search"
          type="text"
        />
      </span>
    </div>
  `,
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
