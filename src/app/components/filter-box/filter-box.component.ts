import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MatChip} from "@angular/material/chips";
import {Store} from "@ngrx/store";
import {filter, Subject, takeUntil} from "rxjs";
import {ISortElement} from "../../models";
import {changeCardSize, changeCollectionMode, changeFilter, changeSort} from "../../store/actions/save.actions";
import {selectCardSize, selectCollectionMode, selectFilter, selectSort} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss']
})
export class FilterBoxComponent implements OnInit, OnDestroy {
  private filter$ = this.store.select(selectFilter);
  public filterFormGroup: FormGroup = new FormGroup({
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

  private sort$ = this.store.select(selectSort);
  public sortFormGroup: FormGroup = new FormGroup({
    sortBy: new FormControl({name:'ID', element: 'id'}),
    ascOrder: new FormControl (true)
  });
  public sortList: ISortElement[] = [
    {name:'ID', element: 'id'},
    {name:'Cost', element: 'playCost'},
    {name:'DP', element: 'dp'},
    {name:'Level', element: 'cardLv'},
    {name:'Name', element: 'name'}];

  private cardSize$ = this.store.select(selectCardSize);
  public cardSizeFormControl: FormControl = new FormControl(8);

  private collectionMode$ = this.store.select(selectCollectionMode);
  public collectionModeFormControl: FormControl = new FormControl(true);

  private destroy$ = new Subject();

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.filterFormGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((filter) => this.store.dispatch(changeFilter({filter})));
    this.filter$
      .pipe(takeUntil(this.destroy$), filter(value => !!value && value !== this.filterFormGroup.value))
      .subscribe(filter => this.filterFormGroup.setValue(filter, { emitEvent: false }));

    this.sortFormGroup.valueChanges
     .pipe(takeUntil(this.destroy$))
      .subscribe((sort) => this.store.dispatch(changeSort({sort})));
    this.sort$
      .pipe(takeUntil(this.destroy$), filter(value => !!value && value !== this.sortFormGroup.value))
      .subscribe(sort => this.sortFormGroup.setValue(sort, { emitEvent: false }));

    this.cardSizeFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((cardSize) => this.store.dispatch(changeCardSize({cardSize})));
    this.cardSize$
      .pipe(takeUntil(this.destroy$), filter(value => !!value && value !== this.cardSizeFormControl.value))
      .subscribe(cardSize => this.cardSizeFormControl.setValue(cardSize, { emitEvent: false }));

    this.collectionModeFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((collectionMode) => this.store.dispatch(changeCollectionMode({collectionMode})));
    this.collectionMode$
      .pipe(takeUntil(this.destroy$), filter(value => value !== this.collectionModeFormControl.value))
      .subscribe(collectionMode => this.collectionModeFormControl.setValue(collectionMode, { emitEvent: false }));
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }

  toggleSelection(chip: MatChip, sort: ISortElement) {
    chip.toggleSelected();
    this.sortFormGroup.get('sortBy')?.setValue(sort);
  }
}
