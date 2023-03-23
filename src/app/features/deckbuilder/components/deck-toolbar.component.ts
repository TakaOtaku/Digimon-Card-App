import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { ICard, IDeck, IDeckCard } from '../../../../models';
import { createNewDeck, setDeck } from '../../../store/digimon.actions';
import { DeckBuilderViewModel, selectAllCards } from '../../../store/digimon.selectors';
import { emptyDeck } from '../../../store/reducers/digimon.reducers';

@Component({
  selector: 'digimon-deck-toolbar',
  template: `
    <div
      class="toolbar ml-3 mr-3 grid w-[100%-3rem] grid-cols-6 justify-evenly border-b-2 border-slate-600 md:grid-cols-12">
      <div class="primary-color flex h-[30px] flex-row justify-center border-2 border-slate-500 pt-1 text-center">
        <b>{{ getCardCount('Egg') }}</b>
        /
        <p class="bottom-font pr-1">5</p>
        <p class="text-xs">Eggs</p>
      </div>

      <div
        class="primary-color col-span-2 flex h-[30px] flex-row justify-center border-2 border-slate-500 pt-1 text-center">
        <b>{{ getCardCount('Main') }}</b>
        /
        <p class="bottom-font pr-1">50</p>
        <p class="text-xs">Cards</p>
      </div>

      <button
        (click)="missingCardsChange.emit(!missingCards)"
        [ngClass]="{ 'primary-background': missingCards }"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-times"
        iconPos="left"
        pButton
        pTooltip="Click to show what cards are missing from your Collection!"
        tooltipPosition="top"></button>

      <button
        (click)="newDeck()"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-file"
        iconPos="left"
        pButton
        pTooltip="Click to create a new Deck!"
        tooltipPosition="top"></button>

      <button
        (click)="save.emit($event)"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-save"
        iconPos="left"
        pButton></button>

      <button
        (click)="importDeckDialog = true"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-upload"
        iconPos="left"
        pButton
        pTooltip="Click to import a deck!"
        tooltipPosition="top"></button>

      <button
        (click)="exportDeckDialog = true"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-download"
        iconPos="left"
        pButton
        pTooltip="Click to export this deck!"
        tooltipPosition="top"></button>

      <button
        (click)="hideStats.emit(true)"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-chart-bar"
        iconPos="left"
        pButton
        pTooltip="Click to hide/show deck statistics!"
        tooltipPosition="top"></button>

      <button
        (click)="share.emit(true)"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-share-alt"
        iconPos="left"
        pButton
        pTooltip="Click to share this deck with the community!"
        tooltipPosition="top"></button>

      <button
        (click)="simulate()"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-refresh"
        iconPos="left"
        pButton
        pTooltip="Click to simulate your draw hand and the security stack!"
        tooltipPosition="top"></button>

      <!--button
        class="p-button-outlined h-[30px] w-full cursor-pointer"
        (click)="checkPrice()"
      >
        $
      </button-->
      <button
        (click)="checkPrice()"
        class="p-button-outlined h-[30px] w-full cursor-pointer"
        icon="pi pi-dollar"
        iconPos="left"
        pButton></button>
    </div>

    <p-dialog
      header="Price Check"
      [(visible)]="priceCheckDialog"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-[100%] min-w-[250px] sm:min-w-[500px] sm:w-[700px] min-h-[500px]"
      [baseZIndex]="10000">
      <digimon-price-check-dialog
        [deckBuilderViewModel]="deckBuilderViewModel"
        [checkPrice]="checkPrice$"></digimon-price-check-dialog>
    </p-dialog>

    <p-dialog
      header="Simulate Security/Draw"
      [(visible)]="simulateDialog"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-[100%] min-w-[250px] sm:min-w-[500px] sm:w-[700px] min-h-[500px]"
      [baseZIndex]="10000">
      <!-- Security Stack -->
      <h1 class="text-center text-2xl font-bold">Security Stack</h1>
      <div class="mt-5 flex flex-row">
        <div *ngFor="let secCard of securityStack" class="cards-in-a-row-5 mr-1">
          <img [src]="secCard.cardImage" [alt]="secCard.id + ' - ' + secCard.name" />
        </div>
      </div>

      <h1 class="text-center text-2xl font-bold">Draw Hand</h1>
      <div class="mt-5 flex flex-row">
        <div *ngFor="let drawCard of drawHand" class="cards-in-a-row-5 mr-1">
          <img [src]="drawCard.cardImage" [alt]="drawCard.id + ' - ' + drawCard.name" />
        </div>
      </div>

      <div class="mt-5 flex w-full justify-end">
        <button pButton (click)="mulligan()">Mulligan</button>
        <button pButton class="ml-5" (click)="resetSimulation()">Reset</button>
      </div>
    </p-dialog>

    <p-dialog
      header="Export Deck"
      [(visible)]="exportDeckDialog"
      styleClass="w-[100%] min-w-[250px] sm:min-w-[500px] sm:w-[700px] min-h-[500px]"
      [baseZIndex]="10000"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      ><digimon-export-deck-dialog [deck]="deck"></digimon-export-deck-dialog
    ></p-dialog>

    <p-dialog
      header="Import Deck"
      [(visible)]="importDeckDialog"
      styleClass="w-[100%] min-w-[250px] sm:min-w-[500px] sm:w-[700px] min-h-[500px]"
      [baseZIndex]="10000"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      ><digimon-import-deck-dialog></digimon-import-deck-dialog
    ></p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckToolbarComponent implements OnDestroy {
  @Input() deck: IDeck;
  @Input() mainDeck: IDeckCard[];
  @Input() missingCards: boolean;
  @Input() deckBuilderViewModel: DeckBuilderViewModel;

  @Output() missingCardsChange = new EventEmitter<boolean>();
  @Output() share = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();
  @Output() hideStats = new EventEmitter<boolean>();

  importDeckDialog = false;
  exportDeckDialog = false;

  priceCheckDialog = false;
  checkPrice$ = new BehaviorSubject(false);

  securityStack: ICard[];
  drawHand: ICard[];
  allDeckCards: ICard[];
  didMulligan = false;
  simulateDialog = false;

  private allCards: ICard[];
  private destroy$ = new Subject<boolean>();

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private store: Store
  ) {
    this.store
      .select(selectAllCards)
      .pipe(takeUntil(this.destroy$))
      .subscribe((allCards) => (this.allCards = allCards));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  /**
   * Get Count of how many Cards are in the Main-Deck or Egg Deck
   */
  getCardCount(which: string): number {
    let count = 0;
    if (which === 'Egg') {
      this.mainDeck.forEach((card) => {
        if (card.cardType === 'Digi-Egg') {
          count += card.count;
        }
      });
    } else {
      this.mainDeck.forEach((card) => {
        if (card.cardType !== 'Digi-Egg') {
          count += card.count;
        }
      });
    }

    return count;
  }

  newDeck() {
    this.confirmationService.confirm({
      key: 'NewDeck',
      message: 'You are about to clear all cards in the deck and make a new one. Are you sure?',
      accept: () => {
        this.store.dispatch(createNewDeck({ reset: true }));
        this.messageService.add({
          severity: 'success',
          summary: 'Deck cleared!',
          detail: 'Deck-Cards were cleared successfully!',
        });
      },
    });
  }

  //region Simulate Card Draw and Security Stack
  simulate() {
    this.simulateDialog = true;
    this.resetSimulation();
  }

  mulligan() {
    if (this.didMulligan) {
      this.messageService.add({
        severity: 'warn',
        summary: 'You already did a Mulligan!',
        detail: 'You can only mulligan once, before resetting.',
      });
      return;
    }

    this.drawHand = this.allDeckCards.slice(10, 15);

    this.didMulligan = true;
  }

  resetSimulation() {
    this.didMulligan = false;

    this.allDeckCards = DeckToolbarComponent.shuffle(
      this.deck.cards.map((card) => this.allCards.find((a) => a.id === card.id))
    );
    this.allDeckCards = this.allDeckCards.filter((card) => card.cardType !== 'Digi-Egg');

    this.securityStack = this.allDeckCards.slice(0, 5);
    this.drawHand = this.allDeckCards.slice(5, 10);
  }

  private static shuffle(array: any[]) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }
  //endregion

  checkPrice() {
    this.priceCheckDialog = true;
    this.checkPrice$.next(true);
  }
}
