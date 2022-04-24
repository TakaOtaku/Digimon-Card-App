import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {IFilter} from "../../../models";
import {changeFilter} from "../../store/digimon.actions";
import {selectFilter} from "../../store/digimon.selectors";
import {emptyFilter} from "../../store/reducers/digimon.reducers";
import {Attributes, Forms, GroupedSets, Keywords, Rarities, Types, Versions} from "../filter-box/filterData";

@Component({
  selector: 'digimon-filter-side-box',
  templateUrl: './filter-side-box.component.html'
})
export class FilterSideBoxComponent implements OnInit {
  setFilter = new FormControl([]);
  rarityFilter = new FormControl([]);
  versionFilter = new FormControl([]);
  keywordFilter = new FormControl([]);
  formFilter = new FormControl([]);
  attributeFilter = new FormControl([]);
  typeFilter = new FormControl([]);

  filterFormGroup: FormGroup = new FormGroup({
    setFilter: this.setFilter,
    rarityFilter: this.rarityFilter,
    versionFilter: this.versionFilter,
    keywordFilter: this.keywordFilter,
    formFilter: this.formFilter,
    attributeFilter: this.attributeFilter,
    typeFilter: this.typeFilter,
  });

  cardCountSlider: number[] = [0,5];
  levelSlider: number[] = [2,7];
  playCostSlider: number[] = [0,15];
  digivolutionSlider: number[] = [0,6];
  dpSlider: number[] = [1,15];

  groupedSets = GroupedSets;
  rarities = Rarities;
  versions = Versions;
  keywords = Keywords;
  forms = Forms;
  attributes = Attributes;
  types = Types;

  private filter: IFilter;
  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(selectFilter).pipe(takeUntil(this.onDestroy$))
      .subscribe((filter) => {
        this.filter = filter;

        this.cardCountSlider = [...new Set(filter.cardCountFilter)];
        this.levelSlider = [...new Set(filter.levelFilter)];
        this.playCostSlider = [...new Set(filter.playCostFilter)];
        this.digivolutionSlider = [...new Set(filter.digivolutionFilter)];
        this.dpSlider = [...new Set(filter.dpFilter)];
      });

    this.filterFormGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((filterValue) => {
        const filter: IFilter = {...this.filter, ...filterValue};
        this.store.dispatch(changeFilter({filter}))
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  reset() {
    this.store.dispatch(changeFilter({filter: emptyFilter}));
  }

  updateCardCountSlider() {
    this.store.dispatch(changeFilter({filter: {...this.filter, cardCountFilter: this.cardCountSlider}}));
  }
  updateLevelSlider() {
    this.store.dispatch(changeFilter({filter: {...this.filter, levelFilter: this.levelSlider}}));
  }
  updatePlayCostSlider() {
    this.store.dispatch(changeFilter({filter: {...this.filter, playCostFilter: this.playCostSlider}}));
  }
  updateDigivolutionSlider() {
    this.store.dispatch(changeFilter({filter: {...this.filter, digivolutionFilter: this.digivolutionSlider}}));
  }
  updateDPSlider() {
    this.store.dispatch(changeFilter({filter: {...this.filter, dpFilter: this.dpSlider}}));
  }
}
