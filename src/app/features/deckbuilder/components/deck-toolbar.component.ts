import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { OverlayZoneFixDirective } from '@directives';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject } from 'rxjs';
import * as uuid from 'uuid';
import { DigimonCard, IDeck, IDeckCard, PriceMetric } from '@models';
import { mapToDeckCards } from '@functions';
import { AuthService } from '@services';
import { DialogStore } from '@store';
import { DigimonCardStore } from '@store';
import { SaveStore } from '@store';
import { WebsiteStore } from '@store';
import { CardMarketService } from '../../../services/card-market.service';
import { ImportDeckDialogComponent } from '../../shared/dialogs/import-deck-dialog.component';

@Component({
  selector: 'digimon-deck-toolbar',
  template: `
    <div class="toolbar mx-3 flex flex-row flex-wrap items-center gap-1 border-b border-line pb-2">
      <button type="button" (click)="save.emit($event)" class="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent px-4 text-xs font-semibold text-accent-ink md:h-8 md:flex-none">
        <i class="pi pi-save"></i> Save
      </button>
      <button type="button" (click)="simulate()" class="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-line bg-ink-2 px-3 text-xs font-semibold text-fg hover:border-accent md:h-8 flex-1 md:flex-none" pTooltip="Simulate your draw hand and the security stack" tooltipPosition="top">
        <i class="pi pi-refresh"></i> Test hand
      </button>
      <button
        type="button"
        (click)="missingCardsChange.emit(!missingCards)"
        [attr.aria-pressed]="missingCards"
        class="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-line bg-ink-2 px-3 text-xs font-semibold text-fg hover:border-accent md:h-8 flex-1 md:flex-none"
        [ngClass]="{ 'border-accent text-accent': missingCards }"
        pTooltip="Show only cards missing from your collection"
        tooltipPosition="top">
        <i class="pi pi-filter"></i> Missing
      </button>
      <button type="button" (click)="importDeckDialog = true" class="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-ink-2 px-3 text-xs font-semibold text-fg hover:border-accent md:h-8 md:flex-none"><i class="pi pi-download"></i> Import</button>
      <button type="button" (click)="openExportDeckDialog()" class="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-ink-2 px-3 text-xs font-semibold text-fg hover:border-accent md:h-8 md:flex-none"><i class="pi pi-upload"></i> Export</button>
      <button type="button" (click)="newDeck()" class="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-ink-2 px-3 text-xs font-semibold text-fg hover:border-accent md:h-8 md:flex-none"><i class="pi pi-file"></i> New</button>
    </div>

    <div *ngIf="saveStore.showPrices() && deckTotalValue() !== null" class="mx-3 flex items-center justify-center text-sm font-bold text-green-400">
      <span class="mr-1 text-fg">Deck Value:</span>
      <span>{{ deckTotalValue() | currency: 'EUR' }}</span>
    </div>

    <p-dialog
      header="Test hand"
      [(visible)]="simulateDialog"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-[95vw] max-w-4xl"
      [baseZIndex]="10000">
      <div class="flex flex-col gap-5">
        <section class="flex flex-col gap-2">
          <div class="flex items-baseline justify-between">
            <h3 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Hand</h3>
            <span class="font-mono text-xs text-muted">{{ drawHand?.length ?? 0 }} cards · {{ deckLeft() }} left in deck</span>
          </div>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2">
            @for (card of drawHand; track $index) {
              <img [src]="card.cardImage" [alt]="card.cardNumber + ' ' + card.name.english" class="w-full rounded-lg" />
            }
          </div>
        </section>
        <section class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <h3 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Security stack</h3>
            <button type="button" (click)="revealSecurity = !revealSecurity" class="text-sm text-accent hover:underline">
              {{ revealSecurity ? 'Hide' : 'Reveal' }}
            </button>
          </div>
          <div class="grid grid-cols-5 gap-2">
            @for (card of securityStack; track $index) {
              <img
                [src]="revealSecurity ? card.cardImage : 'assets/images/digimon-card-back.webp'"
                [alt]="revealSecurity ? card.cardNumber + ' ' + card.name.english : 'Face-down security card'"
                class="w-full rounded-lg" />
            }
          </div>
        </section>
        <div class="flex flex-wrap justify-end gap-2">
          <button type="button" (click)="drawCard()" [disabled]="deckLeft() === 0" class="h-11 rounded-lg border border-line bg-ink-2 px-4 font-semibold text-fg hover:border-accent disabled:opacity-40">Draw a card</button>
          <button type="button" (click)="mulligan()" class="h-11 rounded-lg bg-accent px-5 font-semibold text-accent-ink">New hand</button>
        </div>
      </div>
    </p-dialog>

    <p-dialog
      header="Import deck"
      [(visible)]="importDeckDialog"
      styleClass="w-[95vw] max-w-2xl"
      [baseZIndex]="10000"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false">
      <digimon-import-deck-dialog (onClose)="importDeckDialog = false"></digimon-import-deck-dialog>
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
    NgIf,
    DialogModule,
    ImportDeckDialogComponent,
    ConfirmDialogModule,
    CurrencyPipe,
    OverlayZoneFixDirective,
  ],
  providers: [MessageService],
})
export class DeckToolbarComponent {
  @Input() missingCards: boolean;

  @Output() missingCardsChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();

  websiteStore = inject(WebsiteStore);
  dialogStore = inject(DialogStore);
  digimonCardStore = inject(DigimonCardStore);
  private cardMarketService = inject(CardMarketService);
  saveStore = inject(SaveStore);

  deck: Signal<IDeck> = this.websiteStore.deck;
  mainDeck: Signal<IDeckCard[]> = computed(() => mapToDeckCards(this.websiteStore.deck().cards, this.digimonCardStore.cards()));

  deckTotalValue: Signal<number | null> = computed(() => {
    const cards = this.websiteStore.deck().cards;
    if (!cards.length || !this.cardMarketService.isLoaded()) return null;
    const metric = (this.saveStore.settings().priceMetric as PriceMetric) || PriceMetric.Trend;
    return this.cardMarketService.calculateTotalValue(cards, metric);
  });

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
  ) { }

  private static shuffle<T>(array: T[]): T[] {
    const newArray = [...array]; // Create a copy to avoid mutating the original
    let currentIndex = newArray.length;
    let randomIndex;

    // While there remain elements to shuffle
    while (currentIndex > 0) {
      // Pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element
      [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }

    return newArray;
  }

  newDeck() {
    this.confirmationService.confirm({
      key: 'NewDeck',
      message: 'You are about to clear all cards in the deck and make a new one. Are you sure?',
      accept: () => {
        const newDeckID = uuid.v4();
        this.websiteStore.createNewDeck(newDeckID);
        if (this.authService.currentUser()?.uid) {
          this.route.navigateByUrl(`deckbuilder/user/${this.authService.currentUser()?.uid}/deck/${newDeckID}`);
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
    const cards = [];
    this.deck().cards.forEach((card) => {
      for (let i = 0; i < card.count; i++) {
        cards.push(card.id);
      }
    });
    this.allDeckCards = DeckToolbarComponent.shuffle(cards.map((card) => this.digimonCardStore.cards().find((a) => a.id === card)));
    this.allDeckCards = this.allDeckCards.filter((card) => card.cardType !== 'Digi-Egg');

    this.securityStack = this.allDeckCards.slice(0, 5);
    this.drawHand = this.allDeckCards.slice(5, 10);
    this.revealSecurity = false;
  }

  revealSecurity = false;

  // Shuffled deck order: 5 security, then the hand, then the rest
  deckLeft(): number {
    return Math.max(0, (this.allDeckCards?.length ?? 0) - 5 - (this.drawHand?.length ?? 0));
  }

  drawCard() {
    const next = this.allDeckCards[5 + this.drawHand.length];
    if (next) this.drawHand = [...this.drawHand, next];
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
