import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { IDeckFilter } from '../../services/mongo-backend.service';

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
    { label: 'BT1', value: 'BT1' },
    { label: 'BT2', value: 'BT2' },
    { label: 'BT3', value: 'BT3' },
    { label: 'BT4', value: 'BT4' },
    { label: 'BT5', value: 'BT5' },
    { label: 'BT6', value: 'BT6' },
    { label: 'BT7', value: 'BT7' },
    { label: 'BT8', value: 'BT8' },
    { label: 'BT9', value: 'BT9' },
    { label: 'BT10', value: 'BT10' },
    { label: 'BT11', value: 'BT11' },
    { label: 'BT12', value: 'BT12' },
    { label: 'BT13', value: 'BT13' },
    { label: 'BT14', value: 'BT14' },
    { label: 'BT15', value: 'BT15' },
    { label: 'BT16', value: 'BT16' },
    { label: 'BT17', value: 'BT17' },
    { label: 'BT18', value: 'BT18' },
    { label: 'BT19', value: 'BT19' },
    { label: 'BT20', value: 'BT20' },
    { label: 'BT21', value: 'BT21' },
    { label: 'BT22', value: 'BT22' },
    { label: 'BT23', value: 'BT23' },
    { label: 'EX1', value: 'EX1' },
    { label: 'EX2', value: 'EX2' },
    { label: 'EX3', value: 'EX3' },
    { label: 'EX4', value: 'EX4' },
    { label: 'EX5', value: 'EX5' },
    { label: 'EX6', value: 'EX6' },
    { label: 'EX7', value: 'EX7' },
    { label: 'EX8', value: 'EX8' },
    { label: 'EX9', value: 'EX9' },
    { label: 'EX10', value: 'EX10' },
    { label: 'EX11', value: 'EX11' },
    { label: 'RB1', value: 'RB1' },
    { label: 'P', value: 'P' },
    { label: 'ST', value: 'ST' }
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
    console.log('🔄 Filter change detected, current search:', this.currentFilter.search);

    // Clear any existing timer
    clearTimeout(this.debounceTimer);

    // If search is empty, apply immediately (browse all)
    if (!this.currentFilter.search?.trim()) {
      console.log('📭 Search is empty, applying immediately');
      this.applyFilters();
      return;
    }

    // Debounce search input changes with longer delay for better UX
    this.debounceTimer = setTimeout(() => {
      console.log('⏰ Debounce timer fired, applying filters');
      this.applyFilters();
    }, 800); // 800ms debounce for search
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

    console.log('🔍 Frontend applying filter:', cleanFilter);
    this.filterChange.emit(cleanFilter);
  }

  clearFilters() {
    console.log('🧹 Clearing all filters');
    this.currentFilter = {
      limit: 20,
      search: '',
      cardSet: ''
    };
    // Force immediate application
    this.applyFilters();
  }

  browseAll() {
    console.log('🌐 Browse all clicked');
    this.currentFilter = {
      limit: 20,
      search: '',
      cardSet: ''
    };
    // Force immediate application
    this.applyFilters();
  }
}
