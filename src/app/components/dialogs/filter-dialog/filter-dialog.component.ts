import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {changeFilter} from "../../../store/digimon.actions";
import {selectFilterBoxViewModel} from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent implements OnInit {
  filterFormGroup: FormGroup = new FormGroup({
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
  setList: string[] = ['P-', 'BT1', 'BT2', 'BT3', 'BT4', 'BT5', 'BT6', 'BT7', 'EX1', 'ST1', 'ST2', 'ST3', 'ST4', 'ST5', 'ST6', 'ST7', 'ST8'];
  colorList: string[] = ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Purple', 'White'];
  cardTypeList: string[] = ['Digi-Egg', 'Digimon', 'Tamer', 'Option'];
  typeList: string[] = ['Data', 'Vaccine', 'Virus', 'Free', 'Variable'];
  lvList: string[] = ['Lv.2', 'Lv.3', 'Lv.4', 'Lv.5', 'Lv.6', 'Lv.7'];
  rarityList: string[] = ['C', 'UC', 'R', 'SR', 'SEC'];
  versionList: string[] = ['Normal', 'AA', 'Stamped'];

  private destroy$ = new Subject();

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<FilterDialogComponent>,
  ) { }

  ngOnInit(): void {
    this.store.select(selectFilterBoxViewModel).pipe(takeUntil(this.destroy$))
      .subscribe(({filter, sort}) => {
        this.filterFormGroup.setValue(filter,
          { emitEvent: false });
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  applyFilter() {
    this.store.dispatch(changeFilter({filter: this.filterFormGroup.value}));
    this.dialogRef.close();
  }
}
