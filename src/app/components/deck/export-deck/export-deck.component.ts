import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {ToastrService} from "ngx-toastr";
import {Subject, takeUntil} from "rxjs";
import {ICard, IDeck} from "../../../models";
import {selectAllCards} from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-export-deck',
  templateUrl: './export-deck.component.html',
  styleUrls: ['./export-deck.component.css']
})
export class ExportDeckComponent implements OnInit, OnDestroy {
  private digimonCards$ = this.store.select(selectAllCards);
  private digimonCards: ICard[] = [];

  deckText = '';

  exportTypeControl = new FormControl('text');

  private destroy$ = new Subject();

  constructor(
    private store: Store,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ExportDeckComponent>,
    @Inject(MAT_DIALOG_DATA) public deck: IDeck
  ) {
    this.digimonCards$.pipe(takeUntil(this.destroy$)).subscribe(cards => this.digimonCards = cards);
  }

  ngOnInit(): void {
    this.setExportTypeText()

    this.exportTypeControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(type => this.setExportType(type))
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  exportDeck(): void {
    console.log(this.deck);
  }

  setExportType(type: string): void {
    switch(type) {
      default:
      case 'text':
        this.setExportTypeText();
        break;
      case 'tts':
        this.setExportTypeTTS();
        break;
      case 'image':
        this.setExportTypeTTS();
        break;
      case 'octgn':
        this.setExportTypeTTS();
        break;
      case 'untap':
        this.setExportTypeTTS();
        break;
    }
  }

  private setExportTypeText(): void {
    this.deckText = "// Digimon DeckList\n\n";
    this.deck.cards.forEach(card => {
      const dc = this.digimonCards.find(dc => dc.id === card.id)
      this.deckText += `${card.count} ${dc?.name} ${card.id}\n`;
    });
  }

  private setExportTypeTTS(): void {
    this.deckText = '["Exported from https://digimoncard.app\",';
    this.deck.cards.forEach(card => {
      for(let i = 0; i < card.count; i++) {
        this.deckText += `"${card.id}"`;
        if(i < card.count - 1) {
          this.deckText += ',';
        }
      }
    });
    this.deckText += ']';
  }
}
