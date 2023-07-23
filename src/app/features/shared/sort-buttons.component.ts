import { AsyncPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DropdownModule } from 'primeng/dropdown';
import { filter, startWith } from 'rxjs';
import { ISort, ISortElement } from '../../../models';
import { changeSort } from '../../store/digimon.actions';
import { selectSort } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-sort-buttons',
  template: `
    <div class="mb-1 inline-flex rounded-md shadow-sm" role="group">
      <button type="button" (click)="changeOrder()" class="rounded-l-lg border border-gray-200 px-2 py-0.5 hover:backdrop-brightness-150 focus:z-10 focus:ring-2 focus:ring-blue-700">
        <i
          [ngClass]="{
            'pi-sort-amount-down': order,
            'pi-sort-amount-up': !order
          }"
          class="pi text-[#e2e4e6]"></i>
      </button>
      <p-dropdown
        class="rounded-r-md border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700"
        [options]="sortOptions"
        [ngModel]="sort$ | async"
        (ngModelChange)="$event !== sort ? updateStore() : null"
        [style]="{ height: '2rem', lineHeight: '10px' }"
        optionLabel="name">
      </p-dropdown>
    </div>
  `,
  standalone: true,
  imports: [NgClass, DropdownModule, FormsModule, ReactiveFormsModule, AsyncPipe],
})
export class SortButtonsComponent {
  sort: ISortElement = { name: 'ID', element: 'id' };
  order = true;
  sort$ = this.store.select(selectSort).pipe(
    startWith({ name: 'ID', element: 'id' }),
    filter((newSort) => {
      const currentSort: ISort = {
        sortBy: this.sort,
        ascOrder: this.order,
      };
      return newSort !== currentSort;
    })
  );
  sortOptions: ISortElement[] = [
    { name: 'ID', element: 'id' },
    { name: 'Cost', element: 'playCost' },
    { name: 'DP', element: 'dp' },
    { name: 'Level', element: 'cardLv' },
    { name: 'Name', element: 'name' },
    { name: 'Count', element: 'count' },
  ];

  constructor(public store: Store) {}

  updateStore() {
    debugger;
    this.store.dispatch(
      changeSort({
        sort: { sortBy: this.sort, ascOrder: this.order },
      })
    );
  }

  changeOrder() {
    this.order = !this.order;
    this.store.dispatch(
      changeSort({
        sort: { sortBy: this.sort, ascOrder: this.order },
      })
    );
  }
}
