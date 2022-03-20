import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {saveAs} from "file-saver";
import {ToastrService} from "ngx-toastr";
import {Subject, takeUntil} from "rxjs";
import {ISave} from "../../../models";
import {loadSave, setCollection} from "../../../store/digimon.actions";
import {selectSave} from "../../../store/digimon.selectors";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {ImportCollectionComponent} from "../import-collection/import-collection.component";

@Component({
  selector: 'digimon-import-export-dialog',
  templateUrl: './import-export-dialog.component.html',
  styleUrls: ['./import-export-dialog.component.css']
})
export class ImportExportDialogComponent implements OnInit {
  save: string = "";

  private destroy$ = new Subject();

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ImportExportDialogComponent>
  ) {
  }

  ngOnInit(): void {
    this.store.select(selectSave).pipe(takeUntil(this.destroy$))
      .subscribe((save) => {
        this.save = JSON.stringify(save, undefined, 4)
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  exportSave(): void {
    let blob = new Blob([this.save], {type: 'text/json'})
    saveAs(blob, "digimon-card-collector.json");
    this.dialogRef.close();
  }

  handleFileInput(input: any) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const save: ISave = JSON.parse(fileReader.result as string);
        this.store.dispatch(loadSave({save}));
        this.toastr.success('A new save was uploaded.', 'Save Uploaded')
        this.dialogRef.close();
      } catch (e) {
        this.toastr.error('There was an error with the save.', 'Error')
        this.dialogRef.close();
      }
    }
    fileReader.readAsText(input.files[0]);
  }

  importCollection() {
    this.dialog.open(ImportCollectionComponent, {width: '95vmin', height: '500px'})
    this.dialogRef.close();
  }

  deleteSave() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Are you sure?",
        message: "You are about to permanently delete your collection."
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.store.dispatch(setCollection({collection: []}))
      }
    });

    this.dialogRef.close();
  }
}
