import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterStore } from '@store';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'digimon-search',
  template: `
    <p-icon-field class="m-1">
      <p-inputicon styleClass="pi pi-search"></p-inputicon>
      <input [formControl]="search$" class="h-6 w-full text-xs" pInputText placeholder="Search" type="text" />
    </p-icon-field>
  `,
  standalone: true,
  imports: [NgStyle, FormsModule, InputTextModule, ReactiveFormsModule, IconField, InputIcon],
})
export class SearchComponent {
  filterStore = inject(FilterStore);
  search$ = new FormControl<string>('');

  constructor() {
    this.search$.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe((search) => {
      const value = search ? search : '';
      this.filterStore.updateSearchFilter(value);
    });
  }
}
