import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FilterStore } from '../../../store/filter.store';
import { SaveStore } from '../../../store/save.store';
import { FilterSideBoxComponent } from './filter-side-box.component';

@Component({
  selector: 'digimon-filter-and-search',
  template: `
    <div
      class="surface-ground flex h-[70px] w-full flex-col justify-center py-1">
      <div class="my-1 inline-flex h-full w-full">
        <span
          class="p-input-icon-left w-full"
          [ngStyle]="{ display: 'inline-flex' }">
          <i class="pi pi-search h-3"></i>
          <input
            type="text"
            class="w-full text-xs"
            pInputText
            [formControl]="searchFilter"
            placeholder="Search" />
        </span>
        <button
          (click)="this.display = true"
          pButton
          type="button"
          icon="pi pi-filter-fill"
          label="Filter"></button>
      </div>

      <div class="mx-auto my-1 flex flex-row justify-center">
        <span class="text-xs font-bold text-[#e2e4e6]">Collection Mode:</span>
        <input
          type="checkbox"
          class="my-auto ml-1 h-5 w-5"
          [formControl]="collectionMode" />
      </div>
    </div>

    <p-dialog
      header="Filter and Sort"
      [(visible)]="display"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000">
      <digimon-filter-side-box [showColors]="true"></digimon-filter-side-box>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgStyle,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    FilterSideBoxComponent,
  ],
})
export class FilterAndSearchComponent implements OnInit, OnDestroy {
  saveStore = inject(SaveStore);
  filterStore = inject(FilterStore);

  display = false;

  searchFilter = new UntypedFormControl('');
  collectionMode = new UntypedFormControl(false);

  private onDestroy$ = new Subject();

  ngOnInit(): void {
    this.searchFilter.setValue(this.filterStore.searchFilter(), {
      emitEvent: false,
    });

    this.searchFilter.valueChanges
      .pipe(debounceTime(200), takeUntil(this.onDestroy$))
      .subscribe((searchFilter) => {
        this.filterStore.updateSearchFilter(searchFilter);
      });

    effect(() => {
      this.collectionMode.setValue(this.saveStore.collectionMode(), {
        emitEvent: false,
      });
    });

    this.collectionMode.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collectionMode) => {
        const settings = this.saveStore.settings();
        this.saveStore.updateSettings({ ...settings, collectionMode });
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }
}
