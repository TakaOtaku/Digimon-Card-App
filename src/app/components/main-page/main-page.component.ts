import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {saveAs} from "file-saver";
import {Subject, takeUntil} from "rxjs";
import {ISave} from "../../models";
import {loadSave} from "../../store/actions/save.actions";
import {selectSave} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  public save: string = "";

  private destroy$ = new Subject();

  constructor(
    public store: Store
  ) {}

  public ngOnInit(): void {
    this.store.select(selectSave)
      .pipe(takeUntil(this.destroy$))
      .subscribe((save: ISave) => {
        this.save = JSON.stringify(save, undefined, 4)
      });
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }

  public exportSave(): void {
    let blob = new Blob([this.save], {type: 'text/json' })
    saveAs(blob, "digimon-card-collector.json");
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
}
