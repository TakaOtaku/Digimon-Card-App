import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {changeFilter} from "../../store/digimon.actions";
import {selectFilter} from "../../store/digimon.selectors";
import {Attributes, CardTypes, Colors, Forms, GroupedSets, Lvs, Rarities, Types, Versions} from "./filterData";

@Component({
  selector: 'digimon-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss']
})
export class FilterBoxComponent implements OnInit, OnDestroy {
  @Input() public compact = false;

  display = false;

  private formGroup: FormGroup;
  searchFilter = new FormControl('');
  countFilter = new FormControl();

  setFilter = new FormControl([]);
  groupedSets = GroupedSets;

  cardTypeFilter = new FormControl([]);
  cardTypes = CardTypes;

  colorFilter = new FormControl([]);
  colors = Colors;

  formFilter = new FormControl([]);
  forms = Forms;

  attributeFilter = new FormControl([]);
  attributes = Attributes;

  typeFilter = new FormControl([]);
  types = Types;

  lvFilter = new FormControl([]);
  lvs = Lvs;

  rarityFilter = new FormControl([]);
  rarities = Rarities;

  versionFilter = new FormControl([]);
  versions = Versions;

  private destroy$ = new Subject();

  constructor(private store: Store) {
    this.formGroup = new FormGroup({
      searchFilter: this.searchFilter,
      cardCountFilter: this.countFilter,
      setFilter: this.setFilter,
      colorFilter: this.colorFilter,
      cardTypeFilter: this.cardTypeFilter,
      formFilter: this.formFilter,
      attributeFilter: this.attributeFilter,
      typeFilter: this.typeFilter,
      lvFilter: this.lvFilter,
      rarityFilter: this.rarityFilter,
      versionFilter: this.versionFilter,
    })
  }

  ngOnInit(): void {
    this.store.select(selectFilter).pipe(takeUntil(this.destroy$))
      .subscribe((filter) => {
        this.formGroup.setValue(filter, {emitEvent: false});
      });

    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((filter) => {
        this.store.dispatch(changeFilter({filter}))
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
