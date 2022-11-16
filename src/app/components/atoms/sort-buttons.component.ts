import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter, Subject, takeUntil } from 'rxjs';
import { ISort, ISortElement } from '../../../models';
import { changeSort } from '../../store/digimon.actions';
import { selectSort } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-sort-buttons',
  template: `
    <div class="mb-1 inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        (click)="changeOrder()"
        class="rounded-l-lg border border-gray-200 py-0.5 px-2 hover:backdrop-brightness-150 focus:z-10 focus:ring-2 focus:ring-blue-700"
      >
        <i
          [ngClass]="{
            'pi-sort-amount-down': order,
            'pi-sort-amount-up': !order
          }"
          class="pi text-white"
        ></i>
      </button>
      <p-dropdown
        class="rounded-r-md border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700"
        [options]="sortOptions"
        [formControl]="sortForm"
        [style]="{ height: '2rem', lineHeight: '10px' }"
        optionLabel="name"
      >
      </p-dropdown>
    </div>
  `,
})
export class SortButtonsComponent implements OnDestroy {
  sortForm = new FormControl({ name: 'ID', element: 'id' });
  order = true;

  sortOptions: ISortElement[] = [
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
      .pipe(
        filter((newSort) => {
          const currentSort: ISort = {
            sortBy: this.sortForm.value,
            ascOrder: this.order,
          };
          return newSort !== currentSort;
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe((sort) => {
        this.sortForm.setValue(sort.sortBy, { emitEvent: false });
        this.order = sort.ascOrder;
      });

    this.sortForm.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((sort) => {
        this.store.dispatch(
          changeSort({ sort: { sortBy: sort, ascOrder: this.order } })
        );
      });
  }

  public ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  changeOrder() {
    this.order = !this.order;
    this.store.dispatch(
      changeSort({
        sort: { sortBy: this.sortForm.value, ascOrder: this.order },
      })
    );
  }
}
