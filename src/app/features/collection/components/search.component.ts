import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FilterStore } from '../../../store/filter.store';

@Component({
  selector: 'digimon-search',
  template: `
    <span
      [ngStyle]="{ display: 'inline-flex' }"
      class=" p-input-icon-left my-2 w-full px-2">
      <i class="pi pi-search ml-1 h-3"></i>
      <input
        [formControl]="search$"
        class="h-6 w-full text-xs"
        pInputText
        placeholder="Search"
        type="text" />
    </span>
  `,
  standalone: true,
  imports: [
    NgStyle,
    FormsModule,
    InputTextModule,
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
  ],
})
export class SearchComponent {
  filterStore = inject(FilterStore);
  search$ = new FormControl<string>('');

  constructor() {
    this.search$.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((search) => {
        const value = search ? search : '';
        this.filterStore.updateSearchFilter(value);
      });
  }
}
