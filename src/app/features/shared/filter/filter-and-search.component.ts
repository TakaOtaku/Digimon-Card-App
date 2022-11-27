import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subject, takeUntil } from "rxjs";
import { IFilter } from "../../../../models";
import { changeCollectionMode, changeFilter } from "../../../store/digimon.actions";
import { selectCollectionMode, selectFilter } from "../../../store/digimon.selectors";

@Component({
  selector: "digimon-filter-and-search",
  template: `
    <div class="surface-ground flex h-[70px] py-1">
      <div class="flex w-full flex-col justify-center">
        <div class="my-1 inline-flex w-full">
          <span
            class="p-input-icon-left w-full"
            [ngStyle]="{ display: 'inline-flex' }"
          >
            <i class="pi pi-search h-3"></i>
            <input
              type="text"
              class="h-6 w-full text-xs"
              pInputText
              [formControl]="searchFilter"
              placeholder="Search"
              class="w-full"
            />
          </span>
          <button
            (click)="this.display = true"
            pButton
            type="button"
            icon="pi pi-filter-fill"
            label="Filter"
          ></button>
        </div>

        <div class="mx-auto my-1 flex flex-row justify-center">
          <span class="text-xs font-bold text-[#e2e4e6]">Collection Mode:</span>
          <input
            type="checkbox"
            class="my-auto ml-1 h-5 w-5"
            [formControl]="collectionMode"
          />
        </div>
      </div>
    </div>

    <p-dialog
      header="Filter and Sort"
      [(visible)]="display"
      styleClass="w-[100vw] h-[100vh] surface-ground"
      [baseZIndex]="10000"
    >
      <digimon-filter-side-box [showColors]="compact"></digimon-filter-side-box>
    </p-dialog>
  `,
})
export class FilterAndSearchComponent implements OnInit, OnDestroy {
  @Input() public compact = false;

  display = false;

  searchFilter = new FormControl('');
  collectionMode = new FormControl(false);

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
          changeFilter({ filter: { ...this.filter, searchFilter } })
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
        this.store.dispatch(changeCollectionMode({ collectionMode }))
      );
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
