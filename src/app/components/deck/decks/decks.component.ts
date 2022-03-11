import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {IDeck} from "../../../models";
import {selectDecks} from "../../../store/digimon.selectors";
import {DeckContextMenuComponent} from "../../dialogs/deck-context-menu/deck-context-menu.component";
import {ImportDeckComponent} from "../../dialogs/import-deck/import-deck.component";

@Component({
  selector: 'digimon-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
})
export class DecksComponent {
  decks$ = this.store.select(selectDecks);

  constructor(public dialog: MatDialog, private store: Store) { }

  openImportDialog(): void  {
    this.dialog.open(ImportDeckComponent, {width: '600px', height: '500px'});
  }

  openDeckContext(deck: IDeck): void {
    this.dialog.open(DeckContextMenuComponent, {data: deck});
  }
}
