import {Component, OnDestroy} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {importDeck} from 'src/app/store/actions/save.actions';
import {ICard, IDeck, IDeckCard} from "../../models";
import {selectDigimonCards} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-import-deck',
  templateUrl: './import-deck.component.html',
  styleUrls: ['./import-deck.component.css']
})
export class ImportDeckComponent implements OnDestroy {
  private digimonCards$ = this.store.select(selectDigimonCards);
  private digimonCards: ICard[] = [];

  public importPlaceholder = "" +
    "Paste Deck here\n" +
    "\n" +
    " Format:\n" +
    "   Qty Name Id\n" +
    "   Name is optional. Qty(quantity) must be positiv\n" +
    "   Each card can only be declared once\n" +
    "   Import will always pick the regular art card\""

  public deckText = '';

  private destroy$ = new Subject();

  //Import -> Ask for Name, Description, Color, SelectCardID for Image or let empty
  constructor(private store: Store) {
    this.digimonCards$.pipe(takeUntil(this.destroy$)).subscribe(cards => this.digimonCards = cards);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public handleFileInput(input: any) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        let result = (fileReader.result as string).split("\n");
        const deck: IDeck = this.parseDeck(result);
        this.store.dispatch(importDeck({deck}));
      } catch (e) {

      }
    }
    fileReader.readAsText(input.files[0]);
  }

  public importDeck() {
    if(this.deckText === '') {return;}

    let result: string[] = this.deckText.split("\n");
    const deck: IDeck = this.parseDeck(result);
    this.store.dispatch(importDeck({deck}));
  }

  private parseDeck(textArray: string[]): IDeck {
    const deck: IDeck = {
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
