import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { FILTER_OPTIONS, LOGIC_OPTIONS, OPERATOR_OPTIONS } from '../../../models/data';
import { IAdvancedSearch, IAutocompleteItem, IFilterOption, IOperatorOption, ISearchFilter } from '../../../models/interfaces';
import { AdvancedSearchService } from '../../services/advanced-search.service';

@Component({
  selector: 'digimon-advanced-search',
  template: `
    <div class="advanced-search-container">
      <!-- Multi-Select Search Input with Autocomplete -->
      <div class="search-input-container">
        <p-autoComplete
          [(ngModel)]="selectedFilters"
          inputId="advanced-search-input"
          multiple
          fluid
          [suggestions]="suggestions()"
          (completeMethod)="onSearch($event)"
          (onSelect)="onItemSelect($event)"
          (onUnselect)="onItemUnselect($event)"
          (onClear)="onClear()"
          (onKeyDown)="onKeyDown($event)"
          (onBlur)="onInputBlur($event)"
          [placeholder]="getPlaceholder()"
          [showClear]="true"
          [dropdown]="true"
          styleClass="w-full">
          
          <ng-template let-item pTemplate="item">
            <div class="autocomplete-item flex align-items-center gap-2">
              <i [class]="getItemIcon(item)" class="text-sm"></i>
              <span>{{ item.label }}</span>
              <small class="text-secondary ml-auto">{{ getItemDescription(item) }}</small>
            </div>
          </ng-template>
        </p-autoComplete>
      </div>

      <!-- Quick Filters -->
      <div class="quick-filters mt-3" *ngIf="showQuickFilters" style="display: none;">
        <h6 class="text-sm font-semibold mb-2">Quick Filters</h6>
        <div class="flex flex-wrap gap-2">
          <p-button 
            *ngFor="let quick of quickFilters"
            [label]="quick.label"
            (onClick)="addQuickFilter(quick)"
            size="small"
            [outlined]="true">
          </p-button>
        </div>
      </div>
    </div>

    <!-- Help Dialog -->
    <p-dialog 
      header="Advanced Search Help" 
      [(visible)]="showHelp"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [dismissableMask]="true">
      
      <div class="help-content">
        <h6>How to use Advanced Search:</h6>
        <ol class="list-decimal ml-4 mt-2">
          <li>Click in the search box to see available filter options</li>
          <li>Select a field (e.g., "Global Search", "Color", "Rarity", "Play Cost")</li>
          <li>Choose an operator (e.g., "equals", "greater than", "contains")</li>
          <li>Enter or select a value (you can type custom values or choose from suggestions)</li>
          <li>Press Enter or select from dropdown to complete the filter</li>
          <li>Each complete filter (Field + Operator + Value) becomes one search term</li>
          <li>Multiple filters are combined with AND logic</li>
          <li><strong>Global Search:</strong> Use this to search for any text across all card fields (name, effect, type, etc.)</li>
        </ol>

        <h6 class="mt-4">Examples:</h6>
        <ul class="list-disc ml-4 mt-2">
          <li><code>Global Search contains Agumon</code> - Search for "Agumon" anywhere in any card field</li>
          <li><code>Color == Red</code></li>
          <li><code>Rarity == SR</code></li>
          <li><code>Play Cost > 5</code></li>
          <li><code>Effect contains Security</code></li>
          <li><code>Illustrator == Custom Artist Name</code> (custom value)</li>
        </ul>

        <h6 class="mt-4">Available Operators:</h6>
        <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div><strong>Text:</strong> equals, contains, starts with</div>
          <div><strong>Numbers:</strong> equals, greater than, less than</div>
          <div><strong>Arrays:</strong> includes, does not include</div>
        </div>
      </div>
    </p-dialog>
  `,
  styles: [`
    .advanced-search-container {
      padding: 0.5rem;
      width: 100%;
      max-width: 100%;
    }

    .search-input-container {
      width: 100%;
    }

    .autocomplete-item {
      padding: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .autocomplete-item:hover {
      background: var(--highlight-bg);
    }

    .quick-filters {
      border-top: 1px solid var(--surface-border);
      padding-top: 1rem;
    }

    .help-content {
      line-height: 1.5;
    }

    .help-content code {
      background: var(--surface-200);
      padding: 0.125rem 0.25rem;
      border-radius: 3px;
      font-size: 0.875rem;
    }

    /* Custom styling for autocomplete chips/pills */
    :host ::ng-deep .p-autocomplete-chip {
      background-color: #08528d !important;
      color: white !important;
    }

    :host ::ng-deep .p-autocomplete-chip .p-chip-label {
      color: white !important;
    }

    :host ::ng-deep .p-autocomplete-chip .p-chip-remove-icon {
      color: white !important;
    }

    :host ::ng-deep .p-autocomplete-chip:hover {
      background-color: #064080 !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
    ChipModule,
    TagModule,
    DropdownModule,
    DialogModule,
    InputTextModule,
    TooltipModule
  ]
})
export class AdvancedSearchComponent implements OnInit {
  @Input() showQuickFilters = false; // Disabled by default
  @Output() searchChange = new EventEmitter<IAdvancedSearch | null>();

  private advancedSearchService = inject(AdvancedSearchService);

  // Signals
  suggestions = signal<IAutocompleteItem[]>([]);
  selectedFilters = signal<string[]>([]);

  // Component state
  showHelp = false;
  currentStep: 'filter' | 'operator' | 'value' = 'filter';
  currentFilter: Partial<ISearchFilter> = {};
  currentQuery = ''; // Store the current input query
  pendingFilterText = '';
  buildingFilterPills: string[] = []; // Track pills being built into a complete filter

  // Data
  filterOptions = FILTER_OPTIONS;
  operatorOptions = OPERATOR_OPTIONS;
  logicOptions = LOGIC_OPTIONS;

  quickFilters = [
    { label: 'Mega Level', filters: [{ field: 'cardLv', operator: '==', value: '6' }] },
    { label: 'Red Cards', filters: [{ field: 'color', operator: 'includes', value: 'Red' }] },
    { label: 'High DP', filters: [{ field: 'dp', operator: '>=', value: '10000' }] },
    { label: 'Security Cards', filters: [{ field: 'securityEffect', operator: '!=', value: '-' }] },
  ];

  ngOnInit() {
    this.resetCurrentFilter();
  }

  onSearch(event: { query: string }) {
    const query = event.query.toLowerCase();
    
    // Store the current query for potential use in Global Search
    this.currentQuery = query;

    switch (this.currentStep) {
      case 'filter':
        this.suggestions.set(this.getFilterSuggestions(query));
        break;
      case 'operator':
        this.suggestions.set(this.getOperatorSuggestions(query));
        break;
      case 'value':
        this.suggestions.set(this.getValueSuggestions(query));
        break;
    }
  }

  onItemSelect(event: any) {
    const item: IAutocompleteItem = event.value;

    switch (item.type) {
      case 'filter':
        // For Global Search, handle it immediately without going through the normal flow
        if (item.value === 'global_text_search' && this.currentQuery) {
          console.log('Global search selected with query:', this.currentQuery);
          // Just add the search term as a simple pill, don't go through the normal flow
          const currentSelected = this.selectedFilters();
          this.selectedFilters.set([...currentSelected, this.currentQuery]);
          this.resetCurrentFilter();
          this.triggerSearch();
          return;
        }
        
        this.currentFilter.field = item.value;
        this.currentStep = 'operator';
        this.pendingFilterText = `${this.getFieldDisplayName(item.value)}`;
        this.buildingFilterPills = [item.value];
        
        // Clear the autocomplete and show operators
        setTimeout(() => {
          this.suggestions.set(this.getOperatorSuggestions(''));
        }, 0);
        break;

      case 'operator':
        this.currentFilter.operator = item.value;
        this.currentStep = 'value';
        this.pendingFilterText = `${this.pendingFilterText} ${item.label}`;
        // Track the actual pill that gets added (the raw value, not display label)
        this.buildingFilterPills.push(item.value); // Track the actual value that gets added
        console.log('onItemSelect - Operator selected, pendingFilterText:', this.pendingFilterText);
        console.log('onItemSelect - Operator selected, buildingFilterPills:', this.buildingFilterPills);
        // Clear the autocomplete and show values
        setTimeout(() => {
          this.suggestions.set(this.getValueSuggestions(''));
        }, 0);
        break;

      case 'value':
        this.currentFilter.value = item.value;
        // Use the actual value, not the display label which might have "(custom value)" suffix
        const completeFilter = `${this.pendingFilterText} ${item.value}`;
        console.log('onItemSelect - Value selected, completeFilter:', completeFilter);

        // Remove all building pills and add the complete filter
        const currentSelected = this.selectedFilters();
        console.log('onItemSelect - Before filtering, currentSelected:', currentSelected);
        console.log('onItemSelect - Pills to remove:', this.buildingFilterPills);

        const withoutBuildingPills = currentSelected.filter(filter =>
          !this.buildingFilterPills.includes(filter) && filter !== item.label && filter !== item.value
        );
        console.log('onItemSelect - After filtering, withoutBuildingPills:', withoutBuildingPills);

        this.selectedFilters.set([...withoutBuildingPills, completeFilter]);
        console.log('onItemSelect - Final selectedFilters:', this.selectedFilters());

        // Reset for next filter
        this.resetCurrentFilter();

        // Automatically trigger search when a complete filter is formed
        this.triggerSearch();
        break;
    }
  }

  onItemUnselect(event: any) {
    const removedItem = event.value;
    console.log('onItemUnselect - Removing item:', removedItem);
    console.log('onItemUnselect - Current selectedFilters:', this.selectedFilters());
    console.log('onItemUnselect - Current buildingFilterPills:', this.buildingFilterPills);
    console.log('onItemUnselect - Current step:', this.currentStep);

    this.selectedFilters.update(filters =>
      filters.filter(filter => filter !== removedItem)
    );

    // Determine the new state based on what's left
    this.recalculateCurrentState();
  }

  private recalculateCurrentState() {
    const currentFilters = this.selectedFilters();
    console.log('recalculateCurrentState - Current filters:', currentFilters);

    // If no filters, reset to start
    if (currentFilters.length === 0) {
      this.resetCurrentFilter();
      return;
    }

    // Check if we have any complete filters (containing field + operator + value)
    const completeFilters = currentFilters.filter(filter =>
      this.parseFilterString(filter) !== null
    );

    // Get remaining incomplete filters (building pills)
    const incompleteFilters = currentFilters.filter(filter =>
      this.parseFilterString(filter) === null
    );

    console.log('recalculateCurrentState - Complete filters:', completeFilters);
    console.log('recalculateCurrentState - Incomplete filters:', incompleteFilters);

    // If only complete filters remain, reset to start for a new filter
    if (incompleteFilters.length === 0) {
      this.resetCurrentFilter();
      return;
    }

    // Analyze incomplete filters to determine current state
    const potentialField = incompleteFilters.find(filter =>
      this.filterOptions.some(option => option.value === filter)
    );

    const potentialOperator = incompleteFilters.find(filter =>
      this.operatorOptions.some(option => option.value === filter)
    );

    console.log('recalculateCurrentState - Potential field:', potentialField);
    console.log('recalculateCurrentState - Potential operator:', potentialOperator);

    if (potentialField && potentialOperator) {
      // We have both field and operator, need value
      const fieldOption = this.filterOptions.find(option => option.value === potentialField);
      const operatorOption = this.operatorOptions.find(option => option.value === potentialOperator);

      this.currentFilter = {
        field: potentialField,
        operator: potentialOperator
      };
      this.currentStep = 'value';
      this.pendingFilterText = `${fieldOption?.label} ${operatorOption?.label}`;
      this.buildingFilterPills = [potentialField, potentialOperator];

      // Show value suggestions
      setTimeout(() => {
        this.suggestions.set(this.getValueSuggestions(''));
      }, 0);

    } else if (potentialField && !potentialOperator) {
      // We have field but no operator, need operator
      const fieldOption = this.filterOptions.find(option => option.value === potentialField);

      this.currentFilter = {
        field: potentialField
      };
      this.currentStep = 'operator';
      this.pendingFilterText = fieldOption?.label || potentialField;
      this.buildingFilterPills = [potentialField];

      // Show operator suggestions
      setTimeout(() => {
        this.suggestions.set(this.getOperatorSuggestions(''));
      }, 0);

    } else {
      // Invalid state or no recognizable field, reset
      this.resetCurrentFilter();
    }

    console.log('recalculateCurrentState - New state:');
    console.log('  currentFilter:', this.currentFilter);
    console.log('  currentStep:', this.currentStep);
    console.log('  pendingFilterText:', this.pendingFilterText);
    console.log('  buildingFilterPills:', this.buildingFilterPills);
  }

  onClear() {
    this.selectedFilters.set([]);
    this.resetCurrentFilter();
    this.searchChange.emit(null); // Clear search when all filters are cleared
  }

  onKeyDown(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    
    if (keyboardEvent.key === 'Enter') {
      const autoCompleteElement = event.target as HTMLElement;
      const inputElement = autoCompleteElement.querySelector('input') || autoCompleteElement as HTMLInputElement;
      const inputValue = (inputElement as HTMLInputElement).value?.trim();

      if (inputValue) {
        if (this.currentStep === 'filter') {
          // If user pressed Enter while in filter step, treat it as a simple global search
          const currentSelected = this.selectedFilters();
          this.selectedFilters.set([...currentSelected, inputValue]);
          this.resetCurrentFilter();
          this.triggerSearch();
          
          // Clear the input
          setTimeout(() => {
            (inputElement as HTMLInputElement).value = '';
          }, 0);
          
          event.preventDefault();
          return;
        } else if (this.currentStep === 'value') {
          // Handle custom value for structured filters
          this.handleCustomValue(inputValue);
          event.preventDefault();

          // Clear the input after handling
          setTimeout(() => {
            (inputElement as HTMLInputElement).value = '';
          }, 0);
        }
      }
    }
  }

  onInputBlur(event: Event) {
    // Handle custom value when user clicks away from input
    if (this.currentStep === 'value') {
      const inputElement = event.target as HTMLInputElement;
      const customValue = inputElement.value?.trim();

      if (customValue && !this.suggestions().some(s => s.value === customValue)) {
        // Only process if it's truly a custom value that wasn't in suggestions
        setTimeout(() => {
          if (inputElement.value?.trim() === customValue) {
            this.handleCustomValue(customValue);
          }
        }, 200); // Small delay to allow for potential item selection
      }
    }
  }

  private handleCustomValue(customValue: string) {
    console.log('handleCustomValue - Input customValue:', customValue);
    console.log('handleCustomValue - Current selectedFilters:', this.selectedFilters());
    console.log('handleCustomValue - Current buildingFilterPills:', this.buildingFilterPills);
    console.log('handleCustomValue - Current pendingFilterText:', this.pendingFilterText);

    this.currentFilter.value = customValue;
    const completeFilter = `${this.pendingFilterText} ${customValue}`;
    console.log('handleCustomValue - Complete filter:', completeFilter);

    // Remove all building pills and add the complete filter
    const currentSelected = this.selectedFilters();
    console.log('handleCustomValue - Before filtering, currentSelected:', currentSelected);
    console.log('handleCustomValue - Pills to remove:', this.buildingFilterPills);

    const withoutBuildingPills = currentSelected.filter(filter =>
      !this.buildingFilterPills.includes(filter)
    );
    console.log('handleCustomValue - After filtering, withoutBuildingPills:', withoutBuildingPills);

    this.selectedFilters.set([...withoutBuildingPills, completeFilter]);
    console.log('handleCustomValue - Final selectedFilters:', this.selectedFilters());

    // Reset for next filter
    this.resetCurrentFilter();

    // Automatically trigger search when a complete filter is formed
    this.triggerSearch();
  }

  private triggerSearch() {
    const filters = this.selectedFilters();
    if (filters.length === 0) {
      this.searchChange.emit(null);
      return;
    }

    // Parse the selected filter strings back into ISearchFilter objects
    const parsedFilters: ISearchFilter[] = [];

    for (const filterString of filters) {
      const parsedFilter = this.parseFilterString(filterString);
      if (parsedFilter) {
        parsedFilters.push(parsedFilter);
      }
    }

    if (parsedFilters.length === 0) {
      this.searchChange.emit(null);
      return;
    }

    const advancedSearch: IAdvancedSearch = {
      expressions: [{
        filters: parsedFilters,
        logic: 'AND'
      }],
      globalLogic: 'OR'
    };

    console.log('triggerSearch - Emitting search:', advancedSearch);
    this.searchChange.emit(advancedSearch);
  }

  addQuickFilter(quickFilter: any) {
    // Convert quick filter to display string and add to selected filters
    for (const filter of quickFilter.filters) {
      const fieldName = this.getFieldDisplayName(filter.field);
      const operatorName = this.operatorOptions.find(op => op.value === filter.operator)?.label || filter.operator;
      const filterString = `${fieldName} ${operatorName} ${filter.value}`;

      this.selectedFilters.update(filters => [...filters, filterString]);
    }

    // Automatically trigger search when quick filters are added
    this.triggerSearch();
  }

  // Helper methods
  private parseFilterString(filterString: string): ISearchFilter | null {
    // First check if it's a simple text search (no operators)
    // If it doesn't contain any operators, treat it as a global search
    const hasOperator = this.operatorOptions.some(op => 
      filterString.includes(` ${op.label} `)
    );
    
    if (!hasOperator) {
      // Simple text search - treat as global search
      return {
        field: 'global_text_search',
        operator: 'contains',
        value: filterString.trim(),
        displayText: filterString
      };
    }

    // Parse a filter string like "Color == Red" back into ISearchFilter
    // This is a simplified parser - you might want to make it more robust

    for (const operator of this.operatorOptions) {
      if (filterString.includes(` ${operator.label} `)) {
        const parts = filterString.split(` ${operator.label} `);
        if (parts.length === 2) {
          const fieldLabel = parts[0].trim();
          const value = parts[1].trim();

          // Find the field by its display name
          const fieldOption = this.filterOptions.find(f => f.label === fieldLabel);
          if (fieldOption) {
            return {
              field: fieldOption.value,
              operator: operator.value,
              value: value,
              displayText: filterString
            };
          }
        }
      }
    }

    return null;
  }

  private getFilterSuggestions(query: string): IAutocompleteItem[] {
    const filteredOptions = this.filterOptions
      .filter(option => option.label.toLowerCase().includes(query))
      .map(option => ({
        type: 'filter' as const,
        label: option.label,
        value: option.value,
        icon: this.getFilterIcon(option),
        data: option
      }));

    // If user typed something and it's not matching "global search" specifically,
    // show a simple search option as the first choice
    if (query.length > 0 && !query.includes('global')) {
      const globalSearchOption = {
        type: 'filter' as const,
        label: `Search for "${query}"`,
        value: 'global_text_search',
        icon: 'pi pi-search',
        data: this.filterOptions.find(opt => opt.value === 'global_text_search')
      };
      return [globalSearchOption, ...filteredOptions];
    }

    return filteredOptions;
  }

  private getOperatorSuggestions(query: string): IAutocompleteItem[] {
    const currentFilterOption = this.filterOptions.find(f => f.value === this.currentFilter.field);
    if (!currentFilterOption) return [];

    // For global search, only allow "contains" operator
    if (currentFilterOption.value === 'global_text_search') {
      return [{
        type: 'operator' as const,
        label: 'contains',
        value: 'contains',
        icon: 'pi pi-search'
      }];
    }

    return this.operatorOptions
      .filter(op =>
        op.compatibleTypes.includes(currentFilterOption.type) &&
        op.label.toLowerCase().includes(query)
      )
      .map(operator => ({
        type: 'operator' as const,
        label: operator.label,
        value: operator.value,
        icon: 'pi pi-filter'
      }));
  }

  private getValueSuggestions(query: string): IAutocompleteItem[] {
    const currentFilterOption = this.filterOptions.find(f => f.value === this.currentFilter.field);
    const suggestions: IAutocompleteItem[] = [];

    // Always add the typed query as a custom option if it's not empty
    if (query && query.trim()) {
      const trimmedQuery = query.trim();
      suggestions.push({
        type: 'value' as const,
        label: `"${trimmedQuery}" (custom value)`,
        value: trimmedQuery,
        icon: 'pi pi-pencil'
      });
    }

    // Add predefined options if they exist
    if (currentFilterOption?.options) {
      const filteredOptions = currentFilterOption.options
        .filter(option => option.toLowerCase().includes(query.toLowerCase()))
        .map(option => ({
          type: 'value' as const,
          label: option,
          value: option,
          icon: 'pi pi-tag'
        }));

      // Avoid duplicates - don't add predefined option if it exactly matches the typed query
      const uniqueOptions = filteredOptions.filter(option =>
        !suggestions.some(existing => existing.value.toLowerCase() === option.value.toLowerCase())
      );

      suggestions.push(...uniqueOptions);
    }

    return suggestions;
  }

  private getFilterIcon(option: IFilterOption): string {
    if (option.value === 'global_text_search') {
      return 'pi pi-search';
    }
    
    switch (option.type) {
      case 'string': return 'pi pi-align-left';
      case 'number': return 'pi pi-hashtag';
      case 'array': return 'pi pi-list';
      case 'range': return 'pi pi-sliders-h';
      default: return 'pi pi-filter';
    }
  }

  private getFieldDisplayName(fieldValue: string): string {
    const option = this.filterOptions.find(f => f.value === fieldValue);
    const displayName = option?.label || fieldValue;
    console.log('getFieldDisplayName - fieldValue:', fieldValue, '-> displayName:', displayName);
    return displayName;
  }

  private resetCurrentFilter() {
    console.log('resetCurrentFilter - Before reset:');
    console.log('  currentFilter:', this.currentFilter);
    console.log('  currentStep:', this.currentStep);
    console.log('  pendingFilterText:', this.pendingFilterText);
    console.log('  buildingFilterPills:', this.buildingFilterPills);

    this.currentFilter = {};
    this.currentStep = 'filter';
    this.currentQuery = ''; // Reset the current query
    this.pendingFilterText = '';
    this.buildingFilterPills = []; // Clear tracked pills

    console.log('resetCurrentFilter - After reset:');
    console.log('  currentFilter:', this.currentFilter);
    console.log('  currentStep:', this.currentStep);
    console.log('  pendingFilterText:', this.pendingFilterText);
    console.log('  buildingFilterPills:', this.buildingFilterPills);
  }

  getPlaceholder(): string {
    switch (this.currentStep) {
      case 'filter': return 'Type to search (e.g., "Agumon") or select a specific field...';
      case 'operator': return 'Choose an operator...';
      case 'value': return 'Enter or select a value...';
      default: return 'Start typing to search...';
    }
  }

  getItemIcon(item: IAutocompleteItem): string {
    return item.icon || 'pi pi-filter';
  }

  getItemDescription(item: IAutocompleteItem): string {
    switch (item.type) {
      case 'filter': return 'Field';
      case 'operator': return 'Operator';
      case 'value': return 'Value';
      default: return '';
    }
  }
}
