import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { GroupedSets } from '../../../../models';
import { FilterStore } from '../../../store/filter.store';

@Component({
  selector: 'digimon-set-filter',
  template: `
    <p-multiSelect
      [filter]="false"
      [ngModel]="setFilter"
      (ngModelChange)="updateFilter($event)"
      [group]="true"
      [options]="groupedSets"
      [showHeader]="false"
      [showToggleAll]="false"
      placeholder="Select a Set"
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
  filterStore = inject(FilterStore);
  setFilter: string[] = this.filterStore.setFilter();

  groupedSets = GroupedSets;

  updateFilter(setFilter: string[]) {
    this.filterStore.updateSetFilter(setFilter);
  }
}
