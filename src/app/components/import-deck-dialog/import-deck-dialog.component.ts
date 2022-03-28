import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {MessageService} from "primeng/api";
import {Subject, takeUntil} from "rxjs";
import {importDeck, setDeck} from 'src/app/store/digimon.actions';
import * as uuid from "uuid";
import {ICard, IDeck, IDeckCard} from "../../../models";
import {selectAllCards} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-import-deck-dialog',
  templateUrl: './import-deck-dialog.component.html'
})
export class ImportDeckDialogComponent implements OnInit, OnDestroy {
  @Input() show: boolean = false;
  @Input() width?: string = '50vw';
  @Input() overwrite?: IDeck;

  importPlaceholder = "" +
    "Paste Deck here\n" +
    "\n" +
    " Format:\n" +
    "   Qty Name Id\n" +
    "   Name is optional. Qty(quantity) must be positiv\n" +
    "   Each card can only be declared once\n" +
    "   Import will always pick the regular art card\""

  deckText = '';

  private digimonCards$ = this.store.select(selectAllCards);
  private digimonCards: ICard[] = [];

  private onDestroy$ = new Subject();

  constructor(private store: Store, private messageService: MessageService) { }

  ngOnInit(): void {
    this.digimonCards$.pipe(takeUntil(this.onDestroy$))
      .subscribe(cards => this.digimonCards = cards);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

  handleFileInput(input: any) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
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
      return;
    }
    this.store.dispatch(importDeck({deck}));
    this.store.dispatch(setDeck({deck}));
    this.show = false;
    this.messageService.add({severity:'success', summary:'Deck imported!', detail:'The deck was imported successfully!'});
  }

  private parseDeck(textArray: string[]): IDeck {
    const deck: IDeck = this.overwrite ?
      {...this.overwrite, cards: []} :
      {
        id: this.overwrite ? this.overwrite : uuid.v4(),
        title: 'Imported Deck',
        color: {name: 'White', img: 'assets/decks/white.svg'},
        cards: []
      };

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
