import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IFilter } from '../../../../models';
import { changeFilter } from '../../../store/digimon.actions';
import { selectFilter } from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-search',
  template: `
    <span
      *ngIf="filter$ | async as filter"
      [ngStyle]="{ display: 'inline-flex' }"
      class=" p-input-icon-left my-2 w-full px-2">
      <i class="pi pi-search ml-1 h-3"></i>
      <input
        (ngModelChange)="searchFilterChange($event, filter)"
        [ngModel]="filter.searchFilter"
        class="h-6 w-full text-xs"
        pInputText
        placeholder="Search"
        type="text" />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  filter$ = this.store.select(selectFilter);

  constructor(private store: Store) {}

  searchFilterChange(searchValue: string, currentFilter: IFilter) {
    const filter: IFilter = { ...currentFilter, searchFilter: searchValue };
    this.store.dispatch(changeFilter({ filter }));
  }
}
