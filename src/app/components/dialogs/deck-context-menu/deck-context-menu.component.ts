import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {IDeck} from "../../../models";
import {deleteDeck, setDeck, setSite} from "../../../store/digimon.actions";
import {SITES} from "../../main-page/main-page.component";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {ExportDeckComponent} from "../export-deck/export-deck.component";

@Component({
  selector: 'digimon-deck-context-menu',
  templateUrl: './deck-context-menu.component.html',
  styleUrls: ['./deck-context-menu.component.css']
})
export class DeckContextMenuComponent implements OnInit, OnDestroy {
  colorFilter = new FormControl({});
  colorList: any[] = [
    {name: 'Red', img: 'assets/decks/red.svg'},
    {name: 'Blue', img: 'assets/decks/blue.svg'},
    {name: 'Yellow', img: 'assets/decks/yellow.svg'},
    {name: 'Green', img: 'assets/decks/green.svg'},
    {name: 'Black', img: 'assets/decks/black.svg'},
    {name: 'Purple', img: 'assets/decks/purple.svg'},
    {name: 'White', img: 'assets/decks/white.svg'}
  ];

  private destroy$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private store: Store,
    public dialogRef: MatDialogRef<DeckContextMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDeck
  ) { }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  saveDeck(): void {
    this.dialogRef.close(
      {title: this.data.title, description: this.data.description, tags: this.data.tags, color: this.colorFilter.value.img}
    );
  }

  viewDeck(): void {
    this.store.dispatch(setDeck({deck: this.data}));
    this.store.dispatch(setSite({site: SITES.DeckBuilder}));
    this.dialogRef.close();
  }

  openExportDialog(): void {
    this.dialog.open(ExportDeckComponent, {data: this.data, width: '90vmin', height: '550px'});
    this.dialogRef.close();
  }

  deleteDeck(): void {
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
