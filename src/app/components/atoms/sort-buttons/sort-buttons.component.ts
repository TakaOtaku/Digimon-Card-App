import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { ISortElement } from '../../../../models';
import { changeSort } from '../../../store/digimon.actions';
import { selectSort } from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-sort-buttons',
  templateUrl: './sort-buttons.component.html',
})
export class SortButtonsComponent implements OnDestroy {
  public sortBy: ISortElement = { name: 'ID', element: 'id' };
  public order = true;

  public sortOptions: ISortElement[] = [
    { name: 'ID', element: 'id' },
    { name: 'Cost', element: 'playCost' },
    { name: 'DP', element: 'dp' },
    { name: 'Level', element: 'cardLv' },
    { name: 'Name', element: 'name' },
    { name: 'Count', element: 'count' },
  ];

  private onDestroy$ = new Subject();

  constructor(public store: Store) {
    this.store
      .select(selectSort)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((sort) => {
        this.sortBy = sort.sortBy;
        this.order = sort.ascOrder;
      });
  }

  public ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  public changeSortOrder(sortBy: ISortElement) {
    if (sortBy === this.sortBy) {
      this.order = !this.order;
    }
    this.store.dispatch(
      changeSort({ sort: { sortBy: sortBy, ascOrder: this.order } })
    );
  }
}
