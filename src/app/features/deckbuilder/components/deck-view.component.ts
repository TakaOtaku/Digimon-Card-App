import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, Output, Signal } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DragDropModule } from 'primeng/dragdrop';
import { first } from 'rxjs';
import { DeckColorMap, DRAG, IDeck, IDeckCard, IDraggedCard, ISave } from '@models';
import { colorSort, compareIDs, levelSort, setColors, setTags } from '@functions';
import { MongoBackendService } from '@services';
import { DigimonCardStore } from '@store';
import { SaveStore } from '@store';
import { WebsiteStore } from '@store';
import { DeckCardComponent } from '../../shared/deck-card.component';
import { DeckMetadataComponent } from './deck-metadata.component';
import { DeckToolbarComponent } from './deck-toolbar.component';

@Component({
  selector: 'digimon-deck-view',
  template: `
    <div class="mx-auto mb-2 max-w-[760px]">
      <digimon-deck-metadata></digimon-deck-metadata>

      <digimon-deck-toolbar
        [missingCards]="missingCards"
        (missingCardsChange)="missingCards = $event"
        (save)="saveDeck($event)"
        (hideStats)="hideStats.emit(true)"></digimon-deck-toolbar>
    </div>

    <p-confirmPopup></p-confirmPopup>

    <ng-container>
      <p-accordion class="mx-auto" [multiple]="true" [activeIndex]="[0, 1]">
        <p-accordionTab [pDroppable]="['toDeck', 'fromSide']" (onDrop)="drop(draggedCard(), 'Main')" [(selected)]="mainExpanded">
          <ng-template pTemplate="header">
            <div>
              {{ 'Main-Deck (' + getCardCount(mainDeck, 'Egg') + '/5 - ' + getCardCount(mainDeck, 'Deck') + '/50)' }}
            </div>
          </ng-template>
          <div
            class="mx-auto grid w-full grid-cols-4 md:grid-cols-6"
            [ngClass]="{
              'lg:grid-cols-8': !collectionView,
            }">
            <digimon-deck-card
              *ngFor="let card of mainDeck"
              pDraggable="fromDeck"
              (onDragStart)="setDraggedCard(card, DRAG.Main)"
              (removeCard)="removeCard(card)"
              [cardHave]="getCardHave(card)"
              [card]="card"
              [missingCards]="missingCards"></digimon-deck-card>
          </div>
        </p-accordionTab>
        <p-accordionTab
          *ngIf="displaySideDeck()"
          [pDroppable]="['toDeck', 'fromDeck']"
          [(selected)]="sideExpanded"
          (onDrop)="drop(draggedCard(), 'Side')"
          [header]="'Side-Deck (' + getCardCount(sideDeck, 'All') + ')'">
          <div class="grid w-full grid-cols-4 md:grid-cols-6">
            <digimon-deck-card
              *ngFor="let card of sideDeck"
              pDraggable="fromSide"
              (onDragStart)="setDraggedCard(card, DRAG.Side)"
              (removeCard)="removeSideCard(card)"
              [cardHave]="getCardHave(card)"
              [sideDeck]="true"
              [card]="card"
              [missingCards]="missingCards"></digimon-deck-card>
          </div>
        </p-accordionTab>
      </p-accordion>
    </ng-container>
  `,
  styleUrls: ['./deck-view.component.scss'],
  standalone: true,
  imports: [
    DeckMetadataComponent,
    DeckToolbarComponent,
    NgFor,
    DeckCardComponent,
    DragDropModule,
    NgIf,
    AccordionModule,
    SharedModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    NgClass,
  ],
  providers: [MessageService],
})
export class DeckViewComponent {
  @Input() collectionView: boolean;

  @Output() onMainDeck = new EventEmitter<IDeckCard[]>();
  @Output() hideStats = new EventEmitter<boolean>();

  mongoBackendService = inject(MongoBackendService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  saveStore = inject(SaveStore);
  websiteStore = inject(WebsiteStore);
  digimonCardStore = inject(DigimonCardStore);

  displaySideDeck = this.saveStore.displaySideDeck;

  mainDeck: IDeckCard[] = [];
  mainExpanded = true;
  sideDeck: IDeckCard[] = [];
  sideExpanded = false;

  draggedCard = this.websiteStore.draggedCard;

  deck: Signal<IDeck> = this.websiteStore.deck;
  save: Signal<ISave> = this.saveStore.save;

  stack = false;
  missingCards = false;

  DRAG = DRAG;

  mapDeck = effect(() => {
    this.mainDeck = [];
    this.sideDeck = [];
    const iDeckCards: IDeckCard[] = [];
    const iSideDeckCards: IDeckCard[] = [];

    this.deck().cards.forEach((card) => {
      const foundCard = this.digimonCardStore.cards().find((item) => compareIDs(item.id, card.id));
      if (foundCard) {
        iDeckCards.push({ ...foundCard, count: card.count });
      }
    });
    (this.deck().sideDeck ?? []).forEach((card) => {
      const foundCard = this.digimonCardStore.cards().find((item) => compareIDs(item.id, card.id));
      if (foundCard) {
        iSideDeckCards.push({ ...foundCard, count: card.count });
      }
    });

    iDeckCards.forEach((card) => this.mainDeck.push({ ...card, count: card.count }));
    iSideDeckCards.forEach((card) => this.sideDeck.push({ ...card, count: card.count }));
    this.deckSort();
    this.onMainDeck.emit(this.mainDeck);
  });

  /**
   * Save the Deck
   */
  saveDeck(event: any) {
    this.confirmationService.confirm({
      target: event.target,
      key: 'save',
      message: 'You are about to save all changes and overwrite everything changed. Are you sure?',
      accept: () => {
        this.onMainDeck.pipe(first()).subscribe(() => {
          this.saveStore.importDeck(this.deck());
          this.messageService.add({
            severity: 'success',
            summary: 'Deck saved!',
            detail: 'Deck was saved successfully!',
          });
        });
        this.mapToDeck();
      },
    });
  }

  /**
   * Update the Cards, Title and Description of the Deck
   */
  mapToDeck() {
    const cards = this.mainDeck.map((card) => ({
      id: card.id,
      count: card.count,
    }));
    const sideDeck = this.sideDeck.map((card) => ({
      id: card.id,
      count: card.count,
    }));

    const tags = setTags(this.deck(), this.digimonCardStore.cards());
    const selectedColor = setColors(this.deck(), this.digimonCardStore.cards());

    const deck = {
      ...this.deck(),
      tags,
      color: DeckColorMap.get(selectedColor.name),
      cards,
      sideDeck,
    };

    this.deckSort();

    this.websiteStore.updateDeck(deck);
    this.onMainDeck.emit(this.mainDeck);
  }

  /**
   * Compare with the collection if you have all necessary Cards
   */
  getCardHave(card: IDeckCard) {
    const foundCards = this.saveStore.collection().filter((colCard) => this.removeP(colCard.id) === card.cardNumber);
    let count = 0;
    foundCards?.forEach((found) => {
      count += found.count;
    });
    return count;
  }

  /**
   * Sort the Deck (Eggs, Digimon, Tamer, Options)
   */
  deckSort() {
    const useColorSort = this.saveStore.settings().sortDeckOrder === 'Color';

    if (useColorSort) {
      this.mainDeck = colorSort(this.mainDeck);
      this.sideDeck = colorSort(this.sideDeck);
    } else {
      this.mainDeck = levelSort(this.mainDeck);
      this.sideDeck = levelSort(this.sideDeck);
    }
  }

  removeP(id: string): string {
    if (!id.includes('_P')) {
      return id;
    }
    return id.split('_P')[0];
  }

  /**
   * Get Count of how many Cards are in the Main-Deck or Egg Deck
   */
  getCardCount(deck: IDeckCard[], which: string): number {
    let count = 0;
    if (which === 'Egg') {
      deck.forEach((card) => {
        if (card.cardType === 'Digi-Egg') {
          count += card.count;
        }
      });
    } else if (which === 'All') {
      deck.forEach((card) => {
        count += card.count;
      });
    } else {
      deck.forEach((card) => {
        if (card.cardType !== 'Digi-Egg') {
          count += card.count;
        }
      });
    }

    return count;
  }

  /**
   * Remove the card from the deck
   */
  removeCard(card: IDeckCard) {
    this.mainDeck = this.mainDeck.filter((value) => value !== card);
    this.mapToDeck();
  }

  removeSideCard(card: IDeckCard) {
    this.sideDeck = this.sideDeck.filter((value) => value !== card);
    this.mapToDeck();
  }

  drop(card: IDraggedCard, area: string) {
    if (area === 'Side') {
      if (card.drag === DRAG.Main) {
        this.websiteStore.removeCardFromDeck(card.card.id);
      }
      this.websiteStore.addCardToSideDeck(card.card.id);
      return;
    }

    if (card.drag === DRAG.Side) {
      this.websiteStore.removeCardFromSideDeck(card.card.id);
    }
    this.websiteStore.addCardToDeck(card.card.id);
  }

  setDraggedCard(card: IDeckCard, drag: DRAG) {
    const dragCard = {
      card: this.digimonCardStore.cardsMap().get(card.id)!,
      drag,
    };
    this.websiteStore.updateDraggedCard(dragCard);
  }
}
