import { WebsiteActions } from './../../store/digimon.actions';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DropdownModule } from 'primeng/dropdown';
import { Observable, distinctUntilChanged } from 'rxjs';
import { ISort, ISortElement } from '../../../models';
import { selectSort } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-sort-buttons',
  template: `
    <div *ngIf="sort$ | async as sort" class="mb-1 inline-flex rounded-md shadow-sm" role="group">
      <button type="button" (click)="changeOrder(sort)" class="rounded-l-lg border border-gray-200 px-2 py-0.5 hover:backdrop-brightness-150 focus:z-10 focus:ring-2 focus:ring-blue-700">
        <i
          [ngClass]="{
            'pi-sort-amount-down': sort.ascOrder,
            'pi-sort-amount-up': !sort.ascOrder
          }"
          class="pi text-[#e2e4e6]"></i>
      </button>
      <p-dropdown
        class="rounded-r-md border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700"
        [options]="sortOptions"
        [(ngModel)]="sortElement"
        (ngModelChange)="updateStore(sort.ascOrder)"
        [style]="{ height: '2rem', lineHeight: '10px' }"
        optionLabel="name">
      </p-dropdown>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgClass, DropdownModule, FormsModule, ReactiveFormsModule, AsyncPipe],
})
export class SortButtonsComponent {
  sortElement = { name: 'ID', element: 'id' };
  sort$: Observable<ISort> = this.store.select(selectSort).pipe(distinctUntilChanged());

  sortOptions: ISortElement[] = [
    { name: 'ID', element: 'id' },
    { name: 'Cost', element: 'playCost' },
    { name: 'DP', element: 'dp' },
    { name: 'Level', element: 'cardLv' },
    { name: 'Name', element: 'name' },
    { name: 'Count', element: 'count' },
  ];

  constructor(public store: Store) {}

  updateStore(ascOrder: boolean) {
    this.store.dispatch(
      WebsiteActions.setsort({
        sort: { sortBy: this.sortElement, ascOrder },
      })
    );
  }

  changeOrder(sort: ISort) {
    const ascOrder = !sort.ascOrder;
    this.store.dispatch(
      WebsiteActions.setsort({
        sort: { ...sort, ascOrder },
      })
    );
  }
}
