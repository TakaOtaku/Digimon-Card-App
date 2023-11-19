import { AsyncPipe, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Observable, Subject } from 'rxjs';
import { DigimonCard, IDeck } from '../../../../models';
import { setColors, setTags } from '../../../functions/digimon-card.functions';
import { stringToDeck } from '../../../functions/parse-deck';
import { selectAllCards } from '../../../store/digimon.selectors';
import { WebsiteActions } from './../../../store/digimon.actions';

@Component({
  selector: 'digimon-import-deck-dialog',
  template: `
    <div>
      <p>
        Copy your deck in the text area and press import or press the "Import
        Text-File"-Button to import a file.
      </p>
      <textarea
        pInputTextarea
        [placeholder]="importPlaceholder"
        id="text-import"
        class="border-black-500 min-h-[200px] min-w-full border-2"
        [(ngModel)]="deckText"></textarea>
    </div>

    <div *ngIf="digimonCards$ | async as allCards" class="mt-5 flex w-full">
      <input
        style="display: none"
        type="file"
        accept=".txt"
        id="file-input"
        (change)="handleFileInput($event.target, allCards)"
        #fileUpload />
      <button pButton (click)="fileUpload.click()">Import Text-File</button>
      <button pButton (click)="importDeck(allCards)" style="margin-left: 5px">
        Import
      </button>
    </div>
  `,
  standalone: true,
  imports: [FormsModule, InputTextareaModule, NgIf, ButtonModule, AsyncPipe],
  providers: [MessageService],
})
export class ImportDeckDialogComponent implements OnDestroy {
  @Input() show: boolean = false;
  digimonCards$: Observable<DigimonCard[]> = this.store.select(selectAllCards);

  @Output() onClose = new EventEmitter<boolean>();

  importPlaceholder =
    '' +
    'Paste Deck here\n' +
    '\n' +
    ' Format:\n' +
    '   Qty Name Id\n' +
    '   TTS Format\n' +
    "   The order of the values doesn't matter\n" +
    '   Name is optional. Qty(quantity) must be positive\n' +
    '   Each card can only be declared once\n' +
    '   Import will always pick the regular art card"';

  deckText = '';

  private onDestroy$ = new Subject();

  constructor(private store: Store, private messageService: MessageService) {}

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

  handleFileInput(input: any, allCards: DigimonCard[]) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        this.deckText = fileReader.result as string;
        this.importDeck(allCards);
      } catch (e) {}
    };
    fileReader.readAsText(input.files[0]);
  }

  // eslint-disable-next-line max-len
  // ["Exported from https://digimoncard.dev","BT5-001","BT5-001","BT5-001","BT9-001","BT9-001","BT8-058","BT8-058","BT8-058","BT8-058","BT9-059","BT9-059","BT9-059","BT9-059","BT8-009","BT8-009","BT8-009","BT8-009","BT9-008","BT9-008","BT8-064","BT8-064","BT8-064","BT8-064","P-076","P-076","P-076","P-076","BT8-011","BT8-011","BT8-011","BT8-067","BT8-067","BT8-067","BT9-065","BT9-065","EX1-008","EX1-008","BT8-084","BT8-084","BT2-112","BT8-070","BT8-070","BT8-070","BT9-068","BT9-068","BT9-112","BT5-086","BT9-090","BT9-090","BT8-086","BT8-086","BT5-092","BT5-092","BT6-106","BT6-106"]
  importDeck(allCards: DigimonCard[]) {
    if (this.deckText === '') return;
    const deck: IDeck | null = stringToDeck(this.deckText, allCards);

    if (!deck || deck.cards?.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Deck error!',
        detail: 'No card could be found!',
      });
      return;
    }

    deck.tags = setTags(deck, allCards);
    deck.color = setColors(deck, allCards);
    this.store.dispatch(WebsiteActions.setDeck({ deck }));
    this.show = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Deck imported!',
      detail: 'The deck was imported successfully!',
    });
  }
}
