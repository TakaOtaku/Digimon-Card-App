import { WebsiteActions } from './../../../store/digimon.actions';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SharedModule } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { tap } from 'rxjs';
import { GroupedSets } from '../../../../models';
import { selectSetFilter } from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-set-filter',
  template: `
    <p-multiSelect
      *ngIf="{ value: setFilter$ | async }"
      [filter]="false"
      [ngModel]="setFilter"
      (ngModelChange)="updateFilter($event)"
      [group]="true"
      [options]="groupedSets"
      [showHeader]="false"
      [showToggleAll]="false"
      defaultLabel="Select a Set"
      display="chip"
      scrollHeight="250px"
      class="mx-auto mb-2 w-full max-w-[250px]"
      styleClass="w-full max-w-[250px] h-8 text-sm">
      <ng-template let-group pTemplate="group">
        <div class="align-items-center flex">
          <span>{{ group.label }}</span>
        </div>
      </ng-template>
    </p-multiSelect>
  `,
  standalone: true,
  imports: [NgIf, MultiSelectModule, FormsModule, SharedModule, AsyncPipe],
})
export class SetFilterComponent {
  setFilter: string[] = [];
  setFilter$ = this.store.select(selectSetFilter).pipe(tap((setFilter) => (this.setFilter = setFilter)));

  groupedSets = GroupedSets;

  constructor(private store: Store) {}

  updateFilter(setFilter: string[]) {
    this.store.dispatch(WebsiteActions.setsetfilter({ setFilter }));
  }
}
