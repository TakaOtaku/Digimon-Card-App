import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';
import { SaveActions, WebsiteActions } from 'src/app/store/digimon.actions';
import { IFilter } from '../../../../models';
import {
  selectCollectionMode,
  selectFilter,
} from '../../../store/digimon.selectors';
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
  display = false;

  searchFilter = new UntypedFormControl('');
  collectionMode = new UntypedFormControl(false);

  private filter: IFilter;
  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectFilter)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((filter) => {
        this.filter = filter;
        this.searchFilter.setValue(filter.searchFilter, { emitEvent: false });
      });

    this.searchFilter.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((searchFilter) => {
        this.store.dispatch(
          WebsiteActions.setFilter({ filter: { ...this.filter, searchFilter } })
        );
      });
    this.store
      .select(selectCollectionMode)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collectionMode) =>
        this.collectionMode.setValue(collectionMode, { emitEvent: false })
      );
    this.collectionMode.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collectionMode) =>
        this.store.dispatch(SaveActions.setCollectionMode({ collectionMode }))
      );
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }
}
