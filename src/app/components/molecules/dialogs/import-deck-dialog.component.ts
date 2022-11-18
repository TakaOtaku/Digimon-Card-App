import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { importDeck, setDeck } from 'src/app/store/digimon.actions';
import * as uuid from 'uuid';
import { ICard, ICountCard, IDeck, IDeckCard } from '../../../../models';
import {
  compareIDs,
  setColors,
  setTags,
} from '../../../functions/digimon-card.functions';
import { selectAllCards } from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-import-deck-dialog',
  template: `<div>
      <p>
        Copy your deck in the text area and press import or press the "Import
        Text-File"-Button to import a file.
      </p>
      <textarea
        pInputTextarea
        [placeholder]="importPlaceholder"
        id="text-import"
        class="border-black-500 min-h-[200px] min-w-full border-2"
        [(ngModel)]="deckText"
      ></textarea>
    </div>

    <div class="mt-5 flex w-full">
      <input
        style="display: none"
        type="file"
        accept=".txt"
        id="file-input"
        (change)="handleFileInput($event.target)"
        #fileUpload
      />
      <button pButton (click)="fileUpload.click()">Import Text-File</button>
      <button pButton (click)="importDeck()" style="margin-left: 5px">
        Import
      </button>
    </div> `,
})
export class ImportDeckDialogComponent implements OnInit, OnDestroy {
  @Input() show: boolean = false;

  @Output() onClose = new EventEmitter<boolean>();

  importPlaceholder =
    '' +
    'Paste Deck here\n' +
    '\n' +
    ' Format:\n' +
    '   Qty Name Id\n' +
    '   TTS Format\n' +
    "   The order of the values doesn't matter\n" +
    '   Name is optional. Qty(quantity) must be positiv\n' +
    '   Each card can only be declared once\n' +
    '   Import will always pick the regular art card"';

  deckText = '';

  private digimonCards$ = this.store.select(selectAllCards);
  private digimonCards: ICard[] = [];

  private onDestroy$ = new Subject();

  constructor(private store: Store, private messageService: MessageService) {}

  ngOnInit(): void {
    this.digimonCards$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cards) => (this.digimonCards = cards));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

  handleFileInput(input: any) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        this.deckText = fileReader.result as string;
        this.importDeck();
      } catch (e) {}
    };
    fileReader.readAsText(input.files[0]);
  }

  //["Exported from https://digimoncard.dev","BT5-001","BT5-001","BT5-001","BT9-001","BT9-001","BT8-058","BT8-058","BT8-058","BT8-058","BT9-059","BT9-059","BT9-059","BT9-059","BT8-009","BT8-009","BT8-009","BT8-009","BT9-008","BT9-008","BT8-064","BT8-064","BT8-064","BT8-064","P-076","P-076","P-076","P-076","BT8-011","BT8-011","BT8-011","BT8-067","BT8-067","BT8-067","BT9-065","BT9-065","EX1-008","EX1-008","BT8-084","BT8-084","BT2-112","BT8-070","BT8-070","BT8-070","BT9-068","BT9-068","BT9-112","BT5-086","BT9-090","BT9-090","BT8-086","BT8-086","BT5-092","BT5-092","BT6-106","BT6-106"]
  importDeck() {
    if (this.deckText === '') return;

    let result: string[] = this.deckText.split('\n');
    let deck: IDeck = this.parseDeck(result);
    if (deck.cards.length === 0) {
      deck = this.parseTTSDeck();
      if (deck.cards.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Deck error!',
          detail: 'No card could be found!',
        });
        return;
      }
    }
    deck.tags = setTags(deck.tags ?? [], deck, this.digimonCards);
    deck.color = setColors(deck, this.digimonCards, deck.color);
    this.store.dispatch(importDeck({ deck }));
    this.store.dispatch(setDeck({ deck }));
    this.show = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Deck imported!',
      detail: 'The deck was imported successfully!',
    });
  }

  private parseTTSDeck(): IDeck {
    const deck: IDeck = {
      id: uuid.v4(),
      title: 'Imported Deck',
      color: { name: 'White', img: 'assets/decks/white.svg' },
      cards: [],
    };

    const deckJson: string[] = JSON.parse(this.deckText);

    deckJson.forEach((entry) => {
      const foundCard = this.digimonCards.find((card) => card.id === entry);
      if (foundCard) {
        const cardInDeck = deck.cards.find(
          (card: ICountCard) => card.id === foundCard.id
        );
        if (cardInDeck) {
          cardInDeck.count++;
        } else {
          deck.cards.push({ id: foundCard.id, count: 1 });
        }
      }
    });
    return deck;
  }

  private parseDeck(textArray: string[]): IDeck {
    const deck: IDeck = {
      id: uuid.v4(),
      title: 'Imported Deck',
      color: { name: 'White', img: 'assets/decks/white.svg' },
      cards: [],
    };

    textArray.forEach((line) => {
      const cardOrNull = this.parseLine(line);
      if (cardOrNull) {
        deck.cards.push(cardOrNull);
      }
    });
    return deck;
  }

  private parseLine(line: string): IDeckCard | null {
    let lineSplit: string[] = line.replace(/  +/g, ' ').split(' ');
    const cardLine: boolean = /\d/.test(line);
    if (cardLine) {
      let matches = lineSplit.filter((string) => string.includes('-'));
      matches = matches.filter((string) => {
        const split = string.split('-');
        return +split[split.length - 1] >>> 0;
      });
      matches = matches.map((string) => {
        if (string.includes('\r')) {
          return string.replace('\r', '');
        }
        return string;
      });
      if (matches.length === 0) {
        return null;
      }
      let cardId = ImportDeckDialogComponent.findCardId(
        matches[matches.length - 1]
      );
      if (!this.digimonCards.find((card) => compareIDs(card.id, cardId))) {
        return null;
      }

      return { count: this.findNumber(lineSplit), id: cardId } as IDeckCard;
    }
    return null;
  }

  private static findCardId(id: string): string {
    if (id.includes('ST')) {
      const splitA = id.split('-');
      const numberA: number = +splitA[0].substring(2) >>> 0;
      return 'ST' + (numberA >= 10 ? numberA : '0' + numberA) + '-' + splitA[1];
    }
    return id;
  }

  private findNumber(array: string[]): number {
    let count = 0;
    array.forEach((string) => {
      let number: number = +string >>> 0;
      if (number > 0) {
        count = number;
      }
    });
    return count;
  }
}
