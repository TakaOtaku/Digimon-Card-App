import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {IFilter} from "../../../models";
import {changeFilter} from "../../store/digimon.actions";
import {selectFilter} from "../../store/digimon.selectors";
import {CardTypes, Colors} from "../filter-box/filterData";

@Component({
  selector: 'digimon-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchFilter = new FormControl('');

  colorFilter = new FormControl([]);
  colors = Colors;

  cardTypeFilter = new FormControl([]);
  cardTypes = CardTypes;

  display = false;

  private filter: IFilter;
  private onDestroy$ = new Subject();

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.select(selectFilter).pipe(takeUntil(this.onDestroy$))
      .subscribe((filter) => {
        this.filter = filter;
        this.searchFilter.setValue(filter.searchFilter, {emitEvent: false});
        this.colorFilter.setValue(filter.colorFilter, {emitEvent: false});
        this.cardTypeFilter.setValue(filter.cardTypeFilter, {emitEvent: false});
      });

    this.searchFilter.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((searchValue) => {
        const filter: IFilter = {...this.filter, searchFilter: searchValue};
        this.store.dispatch(changeFilter({filter}))
      });

    this.colorFilter.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((colorValue) => {
        const filter: IFilter = {...this.filter, colorFilter: colorValue};
        this.store.dispatch(changeFilter({filter}))
      });

    this.cardTypeFilter.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cardTypeValue) => {
        const filter: IFilter = {...this.filter, cardTypeFilter: cardTypeValue};
        this.store.dispatch(changeFilter({filter}))
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  colorChecked(color: string): boolean {
    return this.colorFilter.value.find((value: string) => value === color)
  }
}
