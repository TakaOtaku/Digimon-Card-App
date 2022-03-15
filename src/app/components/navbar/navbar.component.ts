import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MatChip} from "@angular/material/chips";
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {ToastrService} from "ngx-toastr";
import {Subject, takeUntil} from "rxjs";
import {ISortElement} from "../../models";
import {changeCardSize, changeCollectionMode, changeSort, setSite} from "../../store/digimon.actions";
import {selectNavBarViewModel} from "../../store/digimon.selectors";
import {ImportExportDialogComponent} from "../dialogs/import-export-dialog/import-export-dialog.component";
import {SITES} from "../main-page/main-page.component";

@Component({
  selector: 'digimon-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() public compact = false;

  SITES = SITES;
  site = SITES.Collection;

  sortFormGroup: FormGroup = new FormGroup({
    sortBy: new FormControl({name:'ID', element: 'id'}),
    ascOrder: new FormControl (true)
  });
  sortList: ISortElement[] = [
    {name:'ID', element: 'id'},
    {name:'Cost', element: 'playCost'},
    {name:'DP', element: 'dp'},
    {name:'Level', element: 'cardLv'},
    {name:'Name', element: 'name'}];

  cardSizeFormControl: FormControl = new FormControl(40);
  collectionModeFormControl: FormControl = new FormControl(true);

  private destroy$ = new Subject();

  constructor(
    public store: Store,
    public toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.headerSubscriptions();
    this.sortFormGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((sort) => this.store.dispatch(changeSort({sort})));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  private headerSubscriptions(): void {
    this.store.select(selectNavBarViewModel).pipe(takeUntil(this.destroy$))
      .subscribe(({cardSize, collectionMode, site, sort}) => {
        this.site = site;
        this.cardSizeFormControl.setValue(cardSize,
          {emitEvent: false});
        this.collectionModeFormControl.setValue(collectionMode,
          {emitEvent: false});
        this.sortFormGroup.setValue(sort,
          {emitEvent: false});
      });

    this.cardSizeFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((cardSize) => this.store.dispatch(changeCardSize({cardSize})));

    this.collectionModeFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((collectionMode) => this.store.dispatch(changeCollectionMode({collectionMode})));
  }

  importDialog() {
    this.dialog.open(ImportExportDialogComponent);
  }

  switchSite(site: number) {
    this.site = site;
    this.store.dispatch(setSite({site}));
  }

  openPayPal() {
    window.open('https://www.paypal.com/donate/?hosted_button_id=DHQVT7GQ72J98', '_blank');
  }

  toggleSelection(chip: MatChip, sort: ISortElement) {
    if(chip.selected) {
      this.sortFormGroup.get('ascOrder')?.setValue(!this.sortFormGroup.get('ascOrder')?.value);
      return;
    }
    chip.toggleSelected();
    this.sortFormGroup.get('sortBy')?.setValue(sort);
  }
}
