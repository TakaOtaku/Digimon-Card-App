import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {setSave} from 'src/app/store/digimon.actions';
import {ISave} from "../../models";
import {selectSave} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.css']
})
export class SaveDialogComponent implements OnInit, OnDestroy {
  public save: string = "";

  private destroy$ = new Subject();

  constructor(public store: Store) { }

  ngOnInit(): void {
    this.store.select(selectSave)
      .pipe(takeUntil(this.destroy$))
      .subscribe((save: ISave) => this.save = JSON.stringify(save));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  public setSave(): void {
    try {
      const save: ISave = JSON.parse(this.save);
      this.store.dispatch(setSave({save}));
    } catch (e) {}
  }
}
