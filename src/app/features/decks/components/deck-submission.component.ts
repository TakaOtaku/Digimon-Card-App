import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Countries, ICard, IDeck, IDeckCard, TAGS } from '../../../../models';
import {
  compareIDs,
  sortColors,
} from '../../../functions/digimon-card.functions';
import { sortID } from '../../../functions/filter.functions';
import { stringToDeck } from '../../../functions/parse-deck';
import { AuthService } from '../../../service/auth.service';
import { DigimonBackendService } from '../../../service/digimon-backend.service';
import { selectAllCards } from '../../../store/digimon.selectors';
import { ICardImage } from '../../shared/dialogs/deck-dialog.component';

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
            pInputTextarea
          ></textarea>
          <label for="deckList-input">Deck-List*</label>
        </span>
        <div
          class="grid h-full w-full grid-cols-4 overflow-y-scroll border-2 border-slate-200 md:grid-cols-6 lg:grid-cols-8"
        >
          <digimon-deck-card
            *ngFor="let card of mainDeck"
            [edit]="false"
            [card]="card"
            [cards]="allCards"
          ></digimon-deck-card>
        </div>
      </div>

      <div class="my-3 grid grid-cols-3">
        <span class="p-float-label col-span-2">
          <input
            id="title-input"
            type="text"
            class="w-full"
            pInputText
            formControlName="title"
          />
          <label for="title-input">Title*</label>
        </span>

        <p-dropdown
          styleClass="ml-1 truncate w-full"
          [options]="cardImageOptions"
          formControlName="cardImageId"
          optionLabel="name"
          appendTo="body"
        >
        </p-dropdown>
      </div>

      <span class="p-float-label my-3">
        <textarea
          id="description-input"
          class="w-full"
          formControlName="description"
          pInputTextarea
        ></textarea>
        <label for="description-input">Description</label>
      </span>

      <div class="my-3 grid grid-cols-4">
        <p-dropdown
          styleClass="truncate w-full mr-1"
          [options]="formatOptions"
          formControlName="format"
          appendTo="body"
        >
        </p-dropdown>

        <span class="p-float-label mr-1 w-full">
          <input
            id="player-input"
            type="text"
            class="w-full"
            formControlName="player"
            pInputText
          />
          <label for="player-input">Player*</label>
        </span>

        <span class="p-float-label mr-1 w-full">
          <input
            id="placement-input"
            type="number"
            class="w-full"
            formControlName="placement"
            pInputText
          />
          <label for="placement-input">Placement*</label>
        </span>

        <p-dropdown
          styleClass="truncate w-full mr-1"
          [options]="sizeOptions"
          formControlName="size"
          appendTo="body"
          optionLabel="name"
        >
        </p-dropdown>
      </div>

      <div class="my-3 grid grid-cols-3">
        <span class="p-float-label mr-1 w-full">
          <input
            id="host-input"
            type="text"
            class="w-full"
            formControlName="host"
            pInputText
          />
          <label for="host-input">Host*</label>
        </span>

        <p-dropdown
          styleClass="truncate w-full mr-1"
          [options]="countryOptions"
          formControlName="country"
          optionLabel="name"
          appendTo="body"
        >
        </p-dropdown>

        <p-calendar
          class="w-full"
          styleClass="w-full"
          formControlName="date"
          dateFormat="dd.MM.yy"
        ></p-calendar>
      </div>

      <button
        pButton
        class="p-button-outlined"
        label="Submit the Deck"
      ></button>
    </div>
  `,
})
export class DeckSubmissionComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    deckList: new FormControl(''),
    cardImageId: new FormControl(''),
    format: new FormControl(''),
    placement: new FormControl(1),
    size: new FormControl(''),
    country: new FormControl(''),
    player: new FormControl(''),
    host: new FormControl(''),
    date: new FormControl(new Date()),
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

  allCards: ICard[] = [];

  private onDestroy$ = new Subject();
  constructor(
    private store: Store,
    private router: Router,
    private digimonBackendService: DigimonBackendService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectAllCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allCards) => (this.allCards = allCards));

    this.form
      .get('deckList')
      ?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$)
      )
      .subscribe((deckList: string) => {
        this.deck = stringToDeck(deckList, this.allCards);
        this.deck ? this.mapDeck(this.deck, this.allCards) : null;
        this.cardImageOptions = this.createImageOptions();
        this.form.get('cardImageId')?.setValue(this.cardImageOptions[0]);
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  mapDeck(deck: IDeck, allCards: ICard[]) {
    this.mainDeck = [];
    const iDeckCards: IDeckCard[] = [];

    deck.cards.forEach((card) => {
      const foundCard = allCards.find((item) => compareIDs(item.id, card.id));
      if (foundCard) {
        iDeckCards.push({ ...foundCard, count: card.count });
      }
    });

    iDeckCards.forEach((card) =>
      this.mainDeck.push({ ...card, count: card.count })
    );
    this.levelSort();
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

  createImageOptions(): ICardImage[] {
    return (
      this.mainDeck.map((card) => ({
        name: `${card.id} - ${card.name}`,
        value: card.id,
      })) ?? []
    );
  }

  save() {}
}
