import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { WebsiteActions } from '../../../store/digimon.actions';

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
  search$ = new FormControl<string>('');

  constructor(private store: Store) {
    this.search$.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((search) => {
        const value = search ? search : '';
        this.store.dispatch(WebsiteActions.setSearchFilter({ search: value }));
      });
  }
}
