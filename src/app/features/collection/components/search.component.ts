import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, filter, Subject, tap } from 'rxjs';
import { changeSearchFilter } from '../../../store/digimon.actions';
import { selectSearchFilter } from '../../../store/digimon.selectors';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { NgStyle, AsyncPipe } from '@angular/common';

@Component({
  selector: 'digimon-search',
  template: `
    <span [ngStyle]="{ display: 'inline-flex' }" class=" p-input-icon-left my-2 w-full px-2">
      <i class="pi pi-search ml-1 h-3"></i>
      <input (ngModelChange)="search$.next($event)" [ngModel]="filter$ | async" class="h-6 w-full text-xs" pInputText placeholder="Search" type="text" />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgStyle, FormsModule, InputTextModule, AsyncPipe],
})
export class SearchComponent {
  search = '';
  search$ = new Subject<string>();
  filter$ = this.store.select(selectSearchFilter).pipe(filter((search) => search !== this.search));

  constructor(private store: Store) {
    this.search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((search) => (this.search = search))
      )
      .subscribe((search) => this.store.dispatch(changeSearchFilter({ search })));
  }
}
