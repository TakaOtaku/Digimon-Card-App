import { Component, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { GroupedSets } from '../../../../models';
import { isAlysionSet } from '../../../functions/alysion.functions';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { FilterStore } from '../../../store/filter.store';

@Component({
  selector: 'digimon-set-filter',
  template: `
    <p-multiSelect
      [filter]="false"
      [ngModel]="setFilter"
      (ngModelChange)="updateFilter($event)"
      [group]="true"
      [options]="groupedSets()"
      [showHeader]="false"
      [showToggleAll]="false"
      placeholder="Select a Set"
      display="chip"
      scrollHeight="250px"
      class="mx-auto mb-2 w-full max-w-[250px]"
      styleClass="w-full max-w-[250px] h-8 text-sm leading-[0.75rem]">
      <ng-template let-group pTemplate="group">
        <div class="align-items-center flex">
          <span>{{ group.label }}</span>
        </div>
      </ng-template>
    </p-multiSelect>
  `,
  standalone: true,
  imports: [MultiSelectModule, FormsModule, SharedModule],
})
export class SetFilterComponent {
  filterStore = inject(FilterStore);
  private cardStore = inject(DigimonCardStore);
  setFilter: string[] = this.filterStore.setFilter();

  // Paper hides the Alysion products, Alysion offers only the sets in its pool
  groupedSets = computed(() => {
    if (this.cardStore.format() === 'paper') return GroupedSets.filter((group) => !('value' in group && group.value === 'alysion'));
    return GroupedSets.map((group) => ({ ...group, items: group.items.filter((item) => isAlysionSet(item.value)) })).filter(
      (group) => group.items.length > 0,
    );
  });

  filterChange = effect(() => {
    this.setFilter = this.filterStore.setFilter();
  });

  updateFilter(setFilter: string[]) {
    this.filterStore.updateSetFilter(setFilter);
  }
}
