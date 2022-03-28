import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {changeFilter} from "../../store/digimon.actions";
import {selectFilter} from "../../store/digimon.selectors";

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
  groupedSets = [
    {
      label: 'Standard', value: 'displays',
      items: [
        {label: 'BT1', value: 'BT1'},
        {label: 'BT2', value: 'BT2'},
        {label: 'BT3', value: 'BT3'},
        {label: 'BT4', value: 'BT4'},
        {label: 'BT5', value: 'BT5'},
        {label: 'BT6', value: 'BT6'},
        {label: 'BT7', value: 'BT7'},
        {label: 'BT8', value: 'BT8'}
      ]
    },
    {
      label: 'Extra', value: 'extra',
      items: [
        {label: 'EX1', value: 'EX1'}
      ]
    },
    {
      label: 'Starter Decks', value: 'starter',
      items: [
        {label: 'ST1', value: 'ST1'},
        {label: 'ST2', value: 'ST2'},
        {label: 'ST3', value: 'ST3'},
        {label: 'ST4', value: 'ST4'},
        {label: 'ST5', value: 'ST5'},
        {label: 'ST6', value: 'ST6'},
        {label: 'ST7', value: 'ST7'},
        {label: 'ST8', value: 'ST8'},
        {label: 'ST9', value: 'ST9'}
      ]
    }
  ];

  cardTypeFilter = new FormControl([]);
  cardTypes: string[] = ['Digi-Egg', 'Digimon', 'Tamer', 'Option'];

  colorFilter = new FormControl([]);
  colors: string[] = ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Purple', 'White', 'Multi'];

  typeFilter = new FormControl([]);
  types: string[] = ['Data', 'Vaccine', 'Virus', 'Free', 'Variable'];

  lvFilter = new FormControl([]);
  lvs: string[] = ['Lv.2', 'Lv.3', 'Lv.4', 'Lv.5', 'Lv.6', 'Lv.7'];

  rarityFilter = new FormControl([]);
  rarities: string[] = ['P', 'C', 'U', 'R', 'SR', 'SEC'];

  versionFilter = new FormControl([]);
  versions: string[] = ['Normal', 'AA', 'Stamp'];

  private destroy$ = new Subject();

  constructor(private store: Store) {
    this.formGroup = new FormGroup({
      searchFilter: this.searchFilter,
      cardCountFilter: this.countFilter,
      setFilter: this.setFilter,
      colorFilter: this.colorFilter,
      cardTypeFilter: this.cardTypeFilter,
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

  openFilterDialog() {
    this.display = true;
  }
}
