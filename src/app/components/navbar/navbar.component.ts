import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Store} from "@ngrx/store";
import {saveAs} from "file-saver";
import {ToastrService} from "ngx-toastr";
import {Subject, takeUntil} from "rxjs";
import {ISave} from "../../models";
import {changeCardSize, changeCollectionMode, loadSave, setSite} from "../../store/digimon.actions";
import {selectNavBarViewModel} from "../../store/digimon.selectors";
import {SITES} from "../main-page/main-page.component";

@Component({
  selector: 'digimon-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  SITES = SITES;
  site = SITES.Collection;

  save: string = "";

  cardSizeFormControl: FormControl = new FormControl(8);
  collectionModeFormControl: FormControl = new FormControl(true);

  private destroy$ = new Subject();

  constructor(
    public store: Store,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.headerSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  private headerSubscriptions(): void {
    this.store.select(selectNavBarViewModel).pipe(takeUntil(this.destroy$))
      .subscribe(({save, cardSize, collectionMode}) => {
        this.save = JSON.stringify(save, undefined, 4)

        this.cardSizeFormControl.setValue(cardSize,
          {emitEvent: false })
        this.collectionModeFormControl.setValue(collectionMode,
          { emitEvent: false })
      });

    this.cardSizeFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((cardSize) => this.store.dispatch(changeCardSize({cardSize})));

    this.collectionModeFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((collectionMode) => this.store.dispatch(changeCollectionMode({collectionMode})));
  }

  exportSave(): void {
    let blob = new Blob([this.save], {type: 'text/json' })
    saveAs(blob, "digimon-card-collector.json");
  }

  handleFileInput(input: any) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const save: ISave = JSON.parse(fileReader.result as string);
        this.store.dispatch(loadSave({save}));
        this.toastr.success('A new save was uploaded.', 'Save Uploaded')
      } catch (e) {
        this.toastr.error('There was an error with the save.', 'Error')
      }
    }
    fileReader.readAsText(input.files[0]);
  }

  switchSite(site: number) {
    this.site = site;
    this.store.dispatch(setSite({site}));
  }
}
