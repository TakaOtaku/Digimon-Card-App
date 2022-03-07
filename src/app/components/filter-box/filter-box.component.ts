import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Store} from "@ngrx/store";
import {filter, Subject, takeUntil} from "rxjs";
import {changeFilter} from "../../store/actions/save.actions";
import {selectFilter} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss']
})
export class FilterBoxComponent implements OnInit, OnDestroy {
  private filter$ = this.store.select(selectFilter);
  public filterFormGroup: FormGroup = new FormGroup({
    searchFilter: new FormControl(''),
    cardCountFilter: new FormControl(),
    setFilter: new FormControl([]),
    colorFilter: new FormControl([]),
    cardTypeFilter: new FormControl([]),
    typeFilter: new FormControl([]),
    lvFilter: new FormControl([]),
    rarityFilter: new FormControl([]),
    versionFilter: new FormControl([]),
  });
  public setList: string[] = ['P-', 'BT1', 'BT2', 'BT3', 'BT4', 'BT5', 'BT6', 'BT7', 'EX1', 'ST1', 'ST2', 'ST3', 'ST4', 'ST5', 'ST6', 'ST7', 'ST8'];
  public colorList: string[] = ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Purple', 'White'];
  public cardTypeList: string[] = ['Digitama', 'Digimon', 'Tamer', 'Option'];
  public typeList: string[] = ['Data', 'Vaccine', 'Virus', 'Free', 'Variable'];
  public lvList: string[] = ['Lv.2', 'Lv.3', 'Lv.4', 'Lv.5', 'Lv.6', 'Lv.7'];
  public rarityList: string[] = ['C', 'UC', 'R', 'SR', 'SEC'];
  public versionList: string[] = ['Normal', 'AA', 'Stamped'];

  private destroy$ = new Subject();

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.filterFormGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((filter) => this.store.dispatch(changeFilter({filter})));
    this.filter$
      .pipe(takeUntil(this.destroy$), filter(value => !!value && value !== this.filterFormGroup.value))
      .subscribe(filter => this.filterFormGroup.setValue(filter, { emitEvent: false }));
    }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }


}
