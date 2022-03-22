import {Component, OnDestroy} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {ToastrService} from "ngx-toastr";
import {Subject, takeUntil} from "rxjs";
import {importDeck} from 'src/app/store/digimon.actions';
import * as uuid from 'uuid';
import {ICard, IDeck, IDeckCard} from "../../../models";
import {selectAllCards} from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-import-deck',
  templateUrl: './import-deck.component.html',
  styleUrls: ['./import-deck.component.css']
})
export class ImportDeckComponent implements OnDestroy {
  private digimonCards$ = this.store.select(selectAllCards);
  private digimonCards: ICard[] = [];

  importPlaceholder = "" +
    "Paste Deck here\n" +
    "\n" +
    " Format:\n" +
    "   Qty Name Id\n" +
    "   Name is optional. Qty(quantity) must be positiv\n" +
    "   Each card can only be declared once\n" +
    "   Import will always pick the regular art card\""

  deckText = '';

  private destroy$ = new Subject();

  constructor(
    private store: Store,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ImportDeckComponent>
  ) {
    this.digimonCards$.pipe(takeUntil(this.destroy$)).subscribe(cards => this.digimonCards = cards);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  handleFileInput(input: any) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        this.deckText = (fileReader.result as string);
        this.importDeck();
      } catch (e) {}
    }
    fileReader.readAsText(input.files[0]);
  }

  importDeck() {
    if(this.deckText === '') return;

    let result: string[] = this.deckText.split("\n");
    const deck: IDeck = this.parseDeck(result);
    if(deck.cards.length === 0) {
      this.toastr.warning('No Cards where found. Is your format correct?', 'Deck Import Failed')
      return;
    }
    this.store.dispatch(importDeck({deck}));
    this.toastr.success('A new deck was imported.', 'Deck Imported')
    this.dialogRef.close();
  }

  private parseDeck(textArray: string[]): IDeck {
    const deck: IDeck = {
      id: uuid.v4(),
      title: 'Imported Deck',
      color: {name: 'White', img: 'assets/decks/white.svg'},
      cards: []
    }
    textArray.forEach(line => {
      const cardOrNull = this.parseLine(line);
      if(cardOrNull) {
        deck.cards.push(cardOrNull);
      }
    })
    return deck;
  }

  private parseLine(line: string): IDeckCard | null {
    let lineSplit: string[] = line.replace(/  +/g, ' ').split(" ");
    const cardLine: number = +lineSplit[0]>>>0;
    if(cardLine > 0) {
      let matches = lineSplit.filter(string => string.includes('-'));
      matches = matches.filter(string => {
        const split = string.split('-');
        return +split[split.length - 1] >>> 0;
      });
      matches = matches.map(string => {
        if(string.includes('\r')) {
          return string.replace('\r', '');
        }
        return string;
      })
      if(matches.length === 0) {
        return null;
      }
      if(!this.digimonCards.find(card => card.id === matches[matches.length - 1])) {
        return null;
      }
      return {count: cardLine, id: matches[matches.length - 1]} as IDeckCard;
    }
    return null;
  }
}
