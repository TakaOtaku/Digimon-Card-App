import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { GroupedSets } from '../../../../models';
import { isAlysionSet } from '../../../functions/alysion.functions';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { FilterStore } from '../../../store/filter.store';

@Component({
  selector: 'digimon-set-filter',
  template: `
    <p-multiSelect
      [filter]="true"
      [resetFilterOnHide]="true"
      (onFilter)="query.set($event.filter ?? '')"
      (onPanelHide)="query.set('')"
      filterPlaceHolder="Search sets"
      ariaFilterLabel="Search sets"
      [ngModel]="setFilter"
      (ngModelChange)="updateFilter($event)"
      [group]="true"
      [options]="groupedSets()"
      [showToggleAll]="false"
      placeholder="Select a Set"
      display="chip"
      scrollHeight="250px"
      class="mx-auto mb-2 w-full max-w-[250px]"
      styleClass="w-full max-w-[250px] h-8 text-sm leading-[0.75rem]">
      <ng-template #group let-group>
        <button
          type="button"
          (click)="toggle(group.value); $event.stopPropagation()"
          [attr.aria-expanded]="isOpen(group.value)"
          class="flex w-full items-center justify-between gap-2 py-1 text-left font-semibold">
          <span>{{ group.label }}</span>
          <i [class]="isOpen(group.value) ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" aria-hidden="true"></i>
        </button>
      </ng-template>
    </p-multiSelect>
  `,
  standalone: true,
  imports: [MultiSelectModule, FormsModule],
})
export class SetFilterComponent {
  filterStore = inject(FilterStore);
  private cardStore = inject(DigimonCardStore);
  setFilter: string[] = this.filterStore.setFilter();

  openGroups = signal(new Set<string>());

  query = signal('');

  // Alysion mode offers only the sets in its pool. A collapsed group lists just its selected sets,
  // so the selection stays visible (and keeps its chips). A search looks through every group
  groupedSets = computed(() => {
    const alysion = this.cardStore.format() === 'alysion';
    const selected = this.filterStore.setFilter();
    return GroupedSets.map((group) => ({ ...group, items: group.items.filter((item) => !alysion || isAlysionSet(item.value)) }))
      .filter((group) => group.items.length > 0)
      .map((group) =>
        this.isOpen(group.value) ? group : { ...group, items: group.items.filter((item) => selected.includes(item.value)) },
      );
  });

  isOpen(group: string): boolean {
    return !!this.query().trim() || this.openGroups().has(group);
  }

  toggle(group: string): void {
    this.openGroups.update((groups) => {
      const next = new Set(groups);
      if (!next.delete(group)) next.add(group);
      return next;
    });
  }

  filterChange = effect(() => {
    this.setFilter = this.filterStore.setFilter();
  });

  updateFilter(setFilter: string[]) {
    this.filterStore.updateSetFilter(setFilter);
  }
}
