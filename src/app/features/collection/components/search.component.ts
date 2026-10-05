import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterStore } from '@store';
import { AdvancedSearchComponent } from '../../shared/advanced-search.component';

@Component({
  selector: 'digimon-search',
  template: `
    <div class="w-full">
      <!-- Advanced Search Component as the main search -->
      <digimon-advanced-search 
        (searchChange)="onAdvancedSearchChange($event)">
      </digimon-advanced-search>
    </div>
  `,
  standalone: true,
  imports: [AdvancedSearchComponent],
})
export class SearchComponent implements OnInit {
  filterStore = inject(FilterStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const search = this.route.snapshot.queryParamMap.get('search');
    if (search) {
      this.filterStore.updateAdvancedSearch(search);
    } else {
      this.filterStore.clearAdvancedSearch();
    }
  }

  onAdvancedSearchChange(searchQuery: string): void {
    this.filterStore.updateAdvancedSearch(searchQuery || null);

    // Update URL query parameter without navigating
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: searchQuery ? { search: searchQuery } : {},
      queryParamsHandling: searchQuery ? 'merge' : '',
      replaceUrl: true,
    });
  }
}
