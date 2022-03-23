import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {Subject} from "rxjs";
import {IDeck} from "../../../../models";
import {IColor} from "../../../../models/color.interface";
import {SITES} from "../../../pages/main-page/main-page.component";
import {deleteDeck, setDeck, setSite} from "../../../store/digimon.actions";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'digimon-deck-context-menu',
  templateUrl: './deck-context-menu.component.html',
  styleUrls: ['./deck-context-menu.component.css']
})
export class DeckContextMenuComponent implements OnInit, OnDestroy {
  title: string;
  description: string;
  color: IColor = {name: 'Red', img: 'assets/decks/red.svg'};
  colorList: IColor[] = [
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

  ngOnInit() {
    this.title = this.data.title ?? '';
    this.description = this.data.description ?? '';
    this.color = this.data.color;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  saveDeck(): void {
    this.dialogRef.close({deck: {...this.data, title: this.title, description: this.description, color: this.color}});
  }

  viewDeck(): void {
    this.store.dispatch(setDeck({deck: this.data}));
    this.store.dispatch(setSite({site: SITES.DeckBuilder}));
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
