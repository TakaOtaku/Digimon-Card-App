import { NgFor } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {
  debounceTime,
  distinctUntilChanged,
  first,
  Subject,
  takeUntil,
} from 'rxjs';
import * as uuid from 'uuid';
import {
  Countries,
  DigimonCard,
  IDeck,
  IDeckCard,
  ITournamentDeck,
  TAGS,
} from '../../../../models';
import {
  compareIDs,
  sortColors,
} from '../../../functions/digimon-card.functions';
import { sortID } from '../../../functions/filter.functions';
import { stringToDeck } from '../../../functions/parse-deck';
import { DigimonBackendService } from '../../../services/digimon-backend.service';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { DeckCardComponent } from '../deck-card.component';
import { DigimonCardImage } from './deck-dialog.component';

interface IDropDownItem {
  name: string;
  value: string;
}

@Component({
  selector: 'digimon-deck-submission',
  template: `
    <div [formGroup]="form" class="flex w-full flex-col">
      <div class="my-3 grid h-[300px] grid-cols-2">
        <span class="p-float-label">
          <textarea
            id="deckList-input"
            formControlName="deckList"
            class="h-full w-full"
            pInputTextarea></textarea>
          <label for="deckList-input">Deck-List*</label>
        </span>
        <div
          class="grid h-full w-full grid-cols-4 overflow-y-scroll border-2 border-slate-200 md:grid-cols-6 lg:grid-cols-8">
          <digimon-deck-card
            *ngFor="let card of mainDeck"
            [edit]="false"
            [card]="card"></digimon-deck-card>
        </div>
      </div>

      <div class="my-3 grid grid-cols-3">
        <label class="col-span-2">Title:</label>
        <label>Card Image:</label>
        <input
          id="title-input"
          type="text"
          class="col-span-2 w-full"
          pInputText
          formControlName="title" />

        <p-dropdown
          styleClass="ml-1 truncate w-full"
          [options]="cardImageOptions"
          formControlName="cardImageId"
          optionLabel="name"
          appendTo="body">
        </p-dropdown>
      </div>

      <label>Description:</label>
      <textarea
        id="description-input"
        class="w-full"
        formControlName="description"
        pInputTextarea></textarea>

      <div class="my-3 grid grid-cols-2 lg:grid-cols-4">
        <div class="flex flex-col">
          <label>Format:</label>
          <p-dropdown
            styleClass="truncate w-full mr-1"
            [options]="formatOptions"
            formControlName="format"
            appendTo="body">
          </p-dropdown>
        </div>

        <div class="flex flex-col">
          <label for="player-input">Player:</label>
          <input
            id="player-input"
            type="text"
            class="w-full"
            formControlName="player"
            pInputText />
        </div>

        <div class="flex flex-col">
          <label for="placement-input">Placement:</label>
          <input
            id="placement-input"
            type="number"
            class="w-full"
            formControlName="placement"
            min="1"
            pInputText />
        </div>

        <div class="flex flex-col">
          <label>Tournament Size:</label>
          <p-dropdown
            styleClass="truncate w-full mr-1"
            [options]="sizeOptions"
            formControlName="size"
            appendTo="body"
            optionLabel="name">
          </p-dropdown>
        </div>
      </div>

      <div class="my-3 flex flex-col lg:grid lg:grid-cols-3">
        <span class="p-float-label mr-1 w-full">
          <input
            id="host-input"
            type="text"
            class="w-full"
            formControlName="host"
            pInputText />
          <label for="host-input">Host*</label>
        </span>

        <p-dropdown
          styleClass="truncate w-full mr-1"
          [options]="countryOptions"
          formControlName="country"
          optionLabel="name"
          appendTo="body">
        </p-dropdown>

        <p-calendar
          class="w-full"
          styleClass="w-full"
          formControlName="date"
          dateFormat="dd.MM.yy"></p-calendar>
      </div>

      <button
        pButton
        class="p-button-outlined"
        label="Submit the Deck"
        [disabled]="!form.valid"
        (click)="submit()"></button>
    </div>
  `,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextareaModule,
    NgFor,
    DeckCardComponent,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
  ],
  providers: [MessageService],
})
export class DeckSubmissionComponent implements OnInit, OnChanges, OnDestroy {
  @Input() inputDeck: IDeck | null = null;
  @Output() onClose = new EventEmitter();

  form = new UntypedFormGroup({
    title: new UntypedFormControl('', [Validators.required]),
    description: new UntypedFormControl(''),
    deckList: new UntypedFormControl('', [Validators.required]),
    cardImageId: new UntypedFormControl(''),
    format: new UntypedFormControl(''),
    placement: new UntypedFormControl(1, [
      Validators.required,
      Validators.min(1),
    ]),
    size: new UntypedFormControl(''),
    country: new UntypedFormControl(''),
    player: new UntypedFormControl('', [Validators.required]),
    host: new UntypedFormControl('', [Validators.required]),
    date: new UntypedFormControl(new Date()),
  });

  deck: IDeck | null;
  mainDeck: IDeckCard[] = [];

  cardImageOptions: IDropDownItem[] = [
    { name: 'No Deck-Cards found!', value: '' },
  ];
  formatOptions = TAGS;
  countryOptions = Countries;
  sizeOptions: IDropDownItem[] = [
    { name: 'Small (4-8 Player)', value: 'Small' },
    { name: 'Medium (8-16 Player)', value: 'Medium' },
    { name: 'Large (16-32 Player)', value: 'Large' },
    { name: 'Major Event (32+ Player)', value: 'Major' },
  ];

  private digimonCardStore = inject(DigimonCardStore);
  private onDestroy$ = new Subject();

  constructor(private digimonBackendService: DigimonBackendService) {}

  ngOnInit(): void {
    this.form
      .get('deckList')
      ?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
      )
      .subscribe((deckList: string) => {
        this.deck = stringToDeck(deckList, this.digimonCardStore.cards());
        this.deck
          ? this.mapDeck(this.deck, this.digimonCardStore.cards())
          : null;
        this.cardImageOptions = this.createImageOptions();
        this.form.get('cardImageId')?.setValue(this.cardImageOptions[0]);
      });
    if (this.inputDeck) {
      this.updateValues(this.inputDeck);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputDeck']?.currentValue) {
      this.updateValues(changes['inputDeck']?.currentValue);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  mapDeck(deck: IDeck, allCards: DigimonCard[]) {
    this.mainDeck = [];
    const iDeckCards: IDeckCard[] = [];

    deck.cards.forEach((card) => {
      const foundCard = allCards.find((item) => compareIDs(item.id, card.id));
      if (foundCard) {
        iDeckCards.push({ ...foundCard, count: card.count });
      }
    });

    iDeckCards.forEach((card) =>
      this.mainDeck.push({ ...card, count: card.count }),
    );
    this.levelSort();
  }

  createImageOptions(): DigimonCardImage[] {
    return (
      this.mainDeck.map((card) => ({
        name: `${card.id} - ${card.name}`,
        value: card.id,
      })) ?? []
    );
  }

  submit() {
    const formValues = this.form.value;
    const tournamentDeck: ITournamentDeck = {
      id: uuid.v4(),
      cards: this.deck!.cards,
      sideDeck: this.deck!.sideDeck,
      color: this.deck!.color,
      title: formValues.title,
      description: formValues.description,
      tags: this.deck!.tags,
      date: formValues.date,
      user: formValues.player,
      userId: '',
      imageCardId: formValues.cardImageId.value,
      likes: [],
      placement: formValues.placement,
      country: formValues.country.name,
      player: formValues.player,
      host: formValues.host,
      format: formValues.format,
      size: formValues.size.value,
    };

    this.digimonBackendService
      .createTournamentDeck(tournamentDeck)
      .pipe(first())
      .subscribe();

    this.onClose.emit(true);
  }

  private levelSort() {
    const eggs = this.mainDeck
      .filter((card) => card.cardType === 'Digi-Egg')
      .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

    const lv0 = this.mainDeck
      .filter((card) => card.cardLv === '' && card.cardType === 'Digimon')
      .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

    const lv3 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.3')
      .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));
    const lv4 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.4')
      .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));
    const lv5 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.5')
      .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));
    const lv6 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.6')
      .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));
    const lv7 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.7')
      .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

    const tamer = this.mainDeck
      .filter((card) => card.cardType === 'Tamer')
      .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

    const options = this.mainDeck
      .filter((card) => card.cardType === 'Option')
      .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

    this.mainDeck = [
      ...new Set([
        ...eggs,
        ...lv0,
        ...lv3,
        ...lv4,
        ...lv5,
        ...lv6,
        ...lv7,
        ...tamer,
        ...options,
      ]),
    ];
  }

  private updateValues(inputDeck: IDeck) {
    const formValues = this.form.value;
    let decklist = '// Digimon DeckList\n\n';
    inputDeck.cards.forEach((card) => {
      const dc = this.digimonCardStore
        .cards()
        .find((dc) => compareIDs(dc.id, card.id));
      decklist += `${card.id.replace('ST0', 'ST')} ${dc?.name} ${card.count}\n`;
    });
    this.form.setValue({
      title: inputDeck.title,
      description: inputDeck.description,
      deckList: decklist,
      cardImageId: inputDeck.imageCardId,
      format: formValues.format,
      placement: formValues.placement,
      size: formValues.size,
      country: formValues.country,
      player: formValues.player,
      host: formValues.host,
      date: formValues.date,
    });
    this.deck = inputDeck;
  }
}
