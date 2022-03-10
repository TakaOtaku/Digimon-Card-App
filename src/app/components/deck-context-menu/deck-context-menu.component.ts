import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {deleteDeck} from 'src/app/store/actions/save.actions';
import {IDeck} from "../../models";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {ExportDeckComponent} from "../export-deck/export-deck.component";

@Component({
  selector: 'digimon-deck-context-menu',
  templateUrl: './deck-context-menu.component.html',
  styleUrls: ['./deck-context-menu.component.css']
})
export class DeckContextMenuComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private store: Store,
    public dialogRef: MatDialogRef<DeckContextMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDeck
  ) { }

  ngOnInit(): void {}

  public viewDeck(): void {}

  public openExportDialog(): void {
    this.dialog.open(ExportDeckComponent, {data: this.data, width: '600px', height: '500px'});
    this.dialogRef.close();
  }

  public deleteDeck(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Are you sure?",
        message: "You are about to permanently delete the deck."}
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
        this.store.dispatch(deleteDeck({deck: this.data}))
      }
    });

    this.dialogRef.close();
  }
}
