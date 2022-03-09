import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MatChip} from "@angular/material/chips";
import {Store} from "@ngrx/store";
import {saveAs} from "file-saver";
import {filter, first, Subject, takeUntil} from "rxjs";
import {ISave, ISortElement} from "../../models";
import {changeCardSize, changeCollectionMode, changeSort, loadSave} from "../../store/actions/save.actions";
import {selectCardSize, selectCollectionMode, selectSave, selectSort} from "../../store/digimon.selectors";

export enum SITES {
  'Collection',
  'Decks',
  'DeckBuilder'
}

@Component({
  selector: 'digimon-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  public SITES = SITES;
  public siteToShow: number = SITES.Decks;
  public save: string = "";

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

  constructor(public store: Store) {}

  public ngOnInit(): void {
    this.store.select(selectSave)
      .pipe(takeUntil(this.destroy$), first())
      .subscribe((save: ISave) => {
        this.save = JSON.stringify(save, undefined, 4)
      });

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

  public exportSave(): void {
    let blob = new Blob([this.save], {type: 'text/json' })
    saveAs(blob, "digimon-card-collector.json");
  }

  public switchSite(site: any): void {
    this.siteToShow = site;
  }

  public isDeckBuilder(): string {
    return this.siteToShow === SITES.DeckBuilder ? 'half' : '';
  }

  handleFileInput(input: any) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const save: ISave = JSON.parse(fileReader.result as string);
        this.store.dispatch(loadSave({save}));
      } catch (e) {

      }
    }
    fileReader.readAsText(input.files[0]);
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
