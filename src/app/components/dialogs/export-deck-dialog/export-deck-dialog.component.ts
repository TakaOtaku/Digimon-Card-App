import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Store} from "@ngrx/store";
import {saveAs} from "file-saver";
import {Subject, takeUntil} from "rxjs";
import {ICard, IDeck} from "../../../../models";
import {compareIDs} from "../../../functions/digimon-card.functions";
import {selectAllCards} from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-export-deck-dialog',
  templateUrl: './export-deck-dialog.component.html'
})
export class ExportDeckDialogComponent implements OnInit, OnChanges, OnDestroy {
  @Input() show: boolean = false;
  @Input() deck: IDeck;

  @Output() onClose = new EventEmitter<boolean>();

  exportList = ['TEXT', 'TTS'];
  exportType = '';
  deckText = '';

  private digimonCards$ = this.store.select(selectAllCards);
  private digimonCards: ICard[] = [];

  private onDestroy$ = new Subject();

  constructor(private store: Store) {
  }

  ngOnChanges(changes: SimpleChanges): void {
        this.setExportTypeText();
    }

  ngOnInit(): void {
    this.digimonCards$.pipe(takeUntil(this.onDestroy$))
      .subscribe(cards => this.digimonCards = cards);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

  changeExportType(event: any) {
    switch(event.option) {
      default:
      case 'TEXT':
        this.setExportTypeText();
        break;
      case 'TTS':
        this.setExportTypeTTS();
        break;
    }
  }

  private setExportTypeText(): void {
    this.deckText = "// Digimon DeckList\n\n";
    this.deck.cards.forEach(card => {
      const dc = this.digimonCards.find(dc => compareIDs(dc.id, card.id))
      this.deckText += `${card.id.replace('ST0', 'ST')} ${dc?.name} ${card.count}\n`;
    });
  }

  private setExportTypeTTS(): void {
    this.deckText = '["Exported from https://digimoncard.app\",';
    this.deck.cards.forEach(card => {
      for(let i = 0; i < card.count; i++) {
        this.deckText += `"${card.id.replace('ST0', 'ST')}",`;
      }
    });
    this.deckText = this.deckText.substring(0, this.deckText.length - 1);
    this.deckText += ']';
  }

  exportDeckToFile(): void {
    let blob = new Blob([this.deckText], {type: 'text/txt'})
    saveAs(blob, this.deck.title + ".txt");
  }
}
