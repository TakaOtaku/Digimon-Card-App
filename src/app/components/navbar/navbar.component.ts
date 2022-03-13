import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {ToastrService} from "ngx-toastr";
import {Subject, takeUntil} from "rxjs";
import {changeCardSize, changeCollectionMode, setSite} from "../../store/digimon.actions";
import {selectNavBarViewModel} from "../../store/digimon.selectors";
import {ImportExportDialogComponent} from "../dialogs/import-export-dialog/import-export-dialog.component";
import {SITES} from "../main-page/main-page.component";

@Component({
  selector: 'digimon-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  SITES = SITES;
  site = SITES.Collection;

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
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  private headerSubscriptions(): void {
    this.store.select(selectNavBarViewModel).pipe(takeUntil(this.destroy$))
      .subscribe(({cardSize, collectionMode}) => {
        this.cardSizeFormControl.setValue(cardSize,
          {emitEvent: false})
        this.collectionModeFormControl.setValue(collectionMode,
          {emitEvent: false})
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
}
