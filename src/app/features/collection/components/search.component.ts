import { Component, inject } from '@angular/core';
import { FilterStore } from '@store';
import { IAdvancedSearch } from '@models';
import { AdvancedSearchComponent } from '../../shared/advanced-search.component';

@Component({
  selector: 'digimon-search',
  template: `
    <div class="w-full">
      <!-- Advanced Search Component as the main search -->
      <digimon-advanced-search 
        (searchChange)="onAdvancedSearchChange($event)"
        [showQuickFilters]="false">
      </digimon-advanced-search>
    </div>
  `,
  standalone: true,
  imports: [AdvancedSearchComponent],
})
export class SearchComponent {
  filterStore = inject(FilterStore);

  onAdvancedSearchChange(advancedSearch: IAdvancedSearch | null): void {
    this.filterStore.updateAdvancedSearch(advancedSearch);
  }
}
