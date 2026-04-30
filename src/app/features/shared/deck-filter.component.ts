import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { IDeckFilter } from '../../services/mongo-backend.service';
import { TAGS } from '@models';

@Component({
  selector: 'digimon-deck-filter',
  template: `
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <!-- Single Search Input -->
        <div class="md:col-span-7">
          <p-icon-field class="w-full">
            <p-inputicon styleClass="pi pi-search"></p-inputicon>
            <input
              id="search"
              type="text"
              [(ngModel)]="currentFilter.search"
              placeholder="Search by title, description, user, card IDs, or color..."
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-white bg-gray-800"
              pInputText
              (input)="onFilterChange()"
              (keyup.enter)="applyFilters()" />
          </p-icon-field>
        </div>

        <!-- Sets Filter -->
        <div class="md:col-span-2">
          <p-dropdown
            [options]="setOptions"
            [(ngModel)]="currentFilter.cardSet"
            optionLabel="label"
            optionValue="value"
            placeholder="All Sets"
            (onChange)="onFilterChange()"
            styleClass="w-full">
          </p-dropdown>
        </div>

        <!-- Browse All Button -->
        <div class="md:col-span-2">
          <button
            pButton
            type="button"
            label="Browse All"
            icon="pi pi-list"
            class="p-button-sm w-full"
            styleClass="p-button-outlined"
            style="border-color: #08528d; color: white; background-color: #08528d;"
            (click)="browseAll()">
          </button>
        </div>

        <!-- Submit/Search Button -->
        <div class="md:col-span-1">
          <button
            pButton
            type="button"
            icon="pi pi-search"
            class="p-button-sm w-full"
            styleClass="p-button-outlined"
            style="border-color: #08528d; color: white; background-color: #08528d;"
            (click)="applyFilters()">
          </button>
        </div>
      </div>
  `,
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, DropdownModule, IconField, InputIcon],
})
export class DeckFilterComponent {
  @Input() filter: IDeckFilter = {};
  @Output() filterChange = new EventEmitter<IDeckFilter>();

  currentFilter: IDeckFilter = {};
  private debounceTimer: any;

  setOptions = [
    { label: 'All Sets', value: '' },
    ...TAGS.map(tag => ({ label: tag, value: tag })),
    { label: 'P', value: 'P' },
  ];

  ngOnInit() {
    this.currentFilter = {
      ...this.filter,
      limit: 20 // Always use 20 per page
    };
  }

  ngOnChanges() {
    this.currentFilter = {
      ...this.filter,
      limit: 20 // Always use 20 per page
    };
  }

  onFilterChange() {
    clearTimeout(this.debounceTimer);

    if (!this.currentFilter.search?.trim()) {
      this.applyFilters();
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.applyFilters();
    }, 800);
  }

  applyFilters() {
    clearTimeout(this.debounceTimer);

    // Clean up empty values and prepare filter
    const cleanFilter: IDeckFilter = {
      page: 1, // Reset to first page when filtering
      limit: 20 // Always 20 per page
    };

    // Only include search if it has meaningful content (at least 2 characters)
    const searchValue = this.currentFilter.search?.trim() || '';

    if (searchValue.length >= 2) {
      cleanFilter.search = searchValue;
    }

    // Include card set filter if selected
    if (this.currentFilter.cardSet?.trim()) {
      cleanFilter.cardSet = this.currentFilter.cardSet.trim();
    }

    this.filterChange.emit(cleanFilter);
  }

  clearFilters() {
    this.currentFilter = {
      limit: 20,
      search: '',
      cardSet: ''
    };
    // Force immediate application
    this.applyFilters();
  }

  browseAll() {
    this.currentFilter = {
      limit: 20,
      search: '',
      cardSet: ''
    };
    // Force immediate application
    this.applyFilters();
  }
}
