import { NgClass, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  Signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject } from 'rxjs';
import * as uuid from 'uuid';
import { DigimonCard, IDeck, IDeckCard } from '../../../../models';
import { mapToDeckCards } from '../../../functions';
import { AuthService } from '../../../services/auth.service';
import { DialogStore } from '../../../store/dialog.store';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { WebsiteStore } from '../../../store/website.store';
import { ExportDeckDialogComponent } from '../../shared/dialogs/export-deck-dialog.component';
import { ImportDeckDialogComponent } from '../../shared/dialogs/import-deck-dialog.component';
import { PriceCheckDialogComponent } from './price-check-dialog.component';

@Component({
  selector: 'digimon-deck-toolbar',
  template: `
    <div
      class="toolbar ml-3 mr-3 flex w-[100%-3rem] flex-row justify-evenly border-b-2 border-slate-600 md:grid-cols-12">
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
        icon="pi pi-download"
        iconPos="left"
        pButton
        pTooltip="Click to import a deck!"
        tooltipPosition="top"></button>

      <button
        (click)="openExportDeckDialog()"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-upload"
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
        (click)="simulate()"
        class="p-button-outlined h-[30px] w-full"
        icon="pi pi-refresh"
        iconPos="left"
        pButton
        pTooltip="Click to simulate your draw hand and the security stack!"
        tooltipPosition="top"></button>

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
        <div
          *ngFor="let secCard of securityStack"
          class="cards-in-a-row-5 mr-1">
          <img
            [src]="secCard.cardImage"
            [alt]="secCard.id + ' - ' + secCard.name" />
        </div>
      </div>

      <h1 class="text-center text-2xl font-bold">Draw Hand</h1>
      <div class="mt-5 flex flex-row">
        <div *ngFor="let drawCard of drawHand" class="cards-in-a-row-5 mr-1">
          <img
            [src]="drawCard.cardImage"
            [alt]="drawCard.id + ' - ' + drawCard.name" />
        </div>
      </div>

      <div class="mt-5 flex w-full justify-end">
        <button pButton (click)="mulligan()">Mulligan</button>
      </div>
    </p-dialog>

    <p-dialog
      header="Import Deck"
      [(visible)]="importDeckDialog"
      styleClass="w-[100%] min-w-[250px] sm:min-w-[500px] sm:w-[700px] min-h-[500px]"
      [baseZIndex]="10000"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false">
      <digimon-import-deck-dialog
        (onClose)="importDeckDialog = false"></digimon-import-deck-dialog>
    </p-dialog>

    <p-confirmDialog
      header="New Deck Confirmation"
      icon="pi pi-file"
      key="NewDeck"
      rejectButtonStyleClass="p-button-outlined"></p-confirmDialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonModule,
    TooltipModule,
    NgClass,
    DialogModule,
    PriceCheckDialogComponent,
    NgFor,
    ExportDeckDialogComponent,
    ImportDeckDialogComponent,
    ConfirmDialogModule,
  ],
  providers: [MessageService],
})
export class DeckToolbarComponent {
  @Input() missingCards: boolean;

  @Output() missingCardsChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();
  @Output() hideStats = new EventEmitter<boolean>();

  websiteStore = inject(WebsiteStore);
  dialogStore = inject(DialogStore);
  digimonCardStore = inject(DigimonCardStore);

  deck: Signal<IDeck> = this.websiteStore.deck;
  mainDeck: Signal<IDeckCard[]> = computed(() =>
    mapToDeckCards(
      this.websiteStore.deck().cards,
      this.digimonCardStore.cards(),
    ),
  );

  importDeckDialog = false;
  priceCheckDialog = false;
  simulateDialog = false;
  checkPrice$ = new BehaviorSubject(false);

  securityStack: DigimonCard[];
  drawHand: DigimonCard[];
  allDeckCards: DigimonCard[];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: Router,
    private authService: AuthService,
  ) {}

  private static shuffle(array: any[]) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  newDeck() {
    this.confirmationService.confirm({
      key: 'NewDeck',
      message:
        'You are about to clear all cards in the deck and make a new one. Are you sure?',
      accept: () => {
        const newDeckID = uuid.v4();
        this.websiteStore.createNewDeck(newDeckID);
        if (this.authService.userData?.uid) {
          this.route.navigateByUrl(
            `deckbuilder/user/${this.authService.userData?.uid}/deck/${newDeckID}`,
          );
        } else {
          this.route.navigateByUrl(`deckbuilder`);
        }
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
    this.mulligan();
  }

  mulligan() {
    this.allDeckCards = DeckToolbarComponent.shuffle(
      this.deck().cards.map((card) =>
        this.digimonCardStore.cards().find((a) => a.id === card.id),
      ),
    );
    this.allDeckCards = this.allDeckCards.filter(
      (card) => card.cardType !== 'Digi-Egg',
    );

    this.securityStack = this.allDeckCards.slice(0, 5);
    this.drawHand = this.allDeckCards.slice(5, 10);
  }
  //endregion

  checkPrice() {
    this.priceCheckDialog = true;
    this.checkPrice$.next(true);
  }

  openExportDeckDialog() {
    this.dialogStore.updateExportDeckDialog({ show: true, deck: this.deck() });
  }
}
