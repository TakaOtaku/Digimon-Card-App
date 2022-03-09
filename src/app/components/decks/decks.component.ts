import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {deleteDeck} from 'src/app/store/actions/save.actions';
import {IDeck} from "../../models";
import {selectDecks} from "../../store/digimon.selectors";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {ExportDeckComponent} from "../export-deck/export-deck.component";
import {ImportDeckComponent} from "../import-deck/import-deck.component";

@Component({
  selector: 'digimon-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
})
export class DecksComponent {
  public decks$ = this.store.select(selectDecks);

  constructor(public dialog: MatDialog, private store: Store) { }

  public viewDeck(deck: IDeck): void {

  }

  public deleteDeck(deck: IDeck): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Are you sure?",
        message: "You are about to permanently delete the deck."}
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
        this.store.dispatch(deleteDeck({deck}))
      }
    });
  }

  public openImportDialog(): void  {
    this.dialog.open(ImportDeckComponent, {width: '600px', height: '500px'});
  }

  public openExportDialog(deck: IDeck): void {
    this.dialog.open(ExportDeckComponent, {data: deck, width: '600px', height: '500px'});
  }
}
