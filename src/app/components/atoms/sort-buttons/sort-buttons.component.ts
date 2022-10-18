import { Component, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Store } from "@ngrx/store";
import { filter, Subject, takeUntil } from "rxjs";
import { ISort, ISortElement } from "../../../../models";
import { changeSort } from "../../../store/digimon.actions";
import { selectSort } from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-sort-buttons',
  templateUrl: './sort-buttons.component.html',
})
export class SortButtonsComponent implements OnDestroy {
  sortForm = new FormControl({ name: 'ID', element: 'id' });
  order = true;

  sortOptions: ISortElement[] = [
    { name: 'ID', element: 'id' },
    { name: 'Cost', element: 'playCost' },
    { name: 'DP', element: 'dp' },
    { name: 'Level', element: 'cardLv' },
    { name: 'Name', element: 'name' },
    { name: 'Count', element: 'count' },
  ];

  private onDestroy$ = new Subject();

  constructor(public store: Store) {
    this.store
      .select(selectSort)
      .pipe(
        filter((newSort) => {
          const currentSort: ISort = {
            sortBy: this.sortForm.value,
            ascOrder: this.order,
          };
          return newSort !== currentSort;
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe((sort) => {
        this.sortForm.setValue(sort.sortBy, { emitEvent: false });
        this.order = sort.ascOrder;
      });

    this.sortForm.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((sort) => {
        this.store.dispatch(
          changeSort({ sort: { sortBy: sort, ascOrder: this.order } })
        );
      });
  }

  public ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  changeOrder() {
    this.order = !this.order;
    this.store.dispatch(
      changeSort({
        sort: { sortBy: this.sortForm.value, ascOrder: this.order },
      })
    );
  }
}
