import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, Output, Signal } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DragDropModule } from 'primeng/dragdrop';
import { first } from 'rxjs';
import { DeckColorMap, DRAG, IDeck, IDeckCard, IDraggedCard, ISave } from '@models';
import { colorSort, compareIDs, DeckCardGroup, deckGroups, levelSort, setColors, setTags } from '@functions';
import { ImgFallbackDirective } from '@directives';
import { MongoBackendService } from '@services';
import { DialogStore, DigimonCardStore } from '@store';
import { SaveStore } from '@store';
import { WebsiteStore } from '@store';
import { DeckCardComponent } from '../../shared/deck-card.component';
import { DeckMetadataComponent } from './deck-metadata.component';
import { DeckToolbarComponent } from './deck-toolbar.component';

@Component({
  selector: 'digimon-deck-view',
  template: `
    <ng-template #viewToggle>
      <div role="group" aria-label="Deck view" class="inline-flex gap-1 rounded-lg border border-line bg-ink-0 p-1">
        <button type="button" [attr.aria-pressed]="!listView" (click)="listView = false"
          class="rounded-md px-3 py-1 text-sm font-semibold" [ngClass]="!listView ? 'bg-line text-fg' : 'text-muted'">Cards</button>
        <button type="button" [attr.aria-pressed]="listView" (click)="listView = true"
          class="rounded-md px-3 py-1 text-sm font-semibold" [ngClass]="listView ? 'bg-line text-fg' : 'text-muted'">List</button>
      </div>
    </ng-template>

    @if (!showcase) {
    <div class="mx-auto mb-2 max-w-[760px]">
      <digimon-deck-metadata></digimon-deck-metadata>

      <digimon-deck-toolbar
        [missingCards]="missingCards"
        (missingCardsChange)="missingCards = $event"
        (save)="saveDeck($event)"
        (hideStats)="hideStats.emit(true)"></digimon-deck-toolbar>
    </div>
    } @else {
      <!-- Showcase: the whole screen for the deck, laid out for screenshots -->
      <section class="mx-3 mb-3 mt-3 flex flex-wrap items-center gap-6 rounded-xl border border-line bg-ink-1 p-5">
        @if (leadImage()) {
          <img [digimonImgFallback]="leadImage()" alt="" class="w-24 shrink-0 rounded-lg" />
        }
        <div class="flex min-w-0 flex-[999_1_26rem] flex-col gap-3">
          <h1 class="m-0 truncate text-4xl font-bold leading-tight text-fg">{{ deck().title || 'Untitled deck' }}</h1>
          <div class="flex flex-wrap items-center gap-2 text-sm">
            @if (deck().color?.name) {
              <span class="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink-2 px-3 py-0.5 text-fg"><span class="h-2.5 w-2.5 rounded-full" [ngClass]="deck().color.name"></span>{{ deck().color.name }}</span>
            }
            @if (deck().user) {
              <span class="rounded-full border border-line bg-ink-2 px-3 py-0.5 text-fg">by {{ deck().user }}</span>
            }
            <span class="rounded-full border border-line bg-ink-2 px-3 py-0.5 text-fg font-mono">{{ getCardCount(mainDeck, 'Deck') }} + {{ getCardCount(mainDeck, 'Egg') }}</span>
            @if (displaySideDeck() && sideDeck.length) {
              <span class="rounded-full border border-line bg-ink-2 px-3 py-0.5 text-fg font-mono">Side {{ getCardCount(sideDeck, 'All') }}</span>
            }
            @for (tag of deck().tags; track tag.name) {
              <span class="rounded-full border border-line bg-ink-2 px-3 py-0.5 text-fg">{{ tag.name }}</span>
            }
          </div>
          @if (deck().description) {
            <p class="m-0 max-w-3xl whitespace-pre-wrap leading-relaxed text-muted">{{ deck().description }}</p>
          }
        </div>
        <div class="flex flex-[1_1_18rem] flex-wrap items-center justify-end gap-2">
          <button type="button" (click)="togglePool.emit()" class="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink"><i class="pi pi-pencil"></i> Edit deck</button>
          <button type="button" (click)="shareImage()" class="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-ink-2 px-4 text-sm font-semibold text-fg hover:border-accent"><i class="pi pi-image"></i> Share image</button>
          <button type="button" (click)="saveDeck($event)" class="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-ink-2 px-4 text-sm font-semibold text-fg hover:border-accent"><i class="pi pi-save"></i> Save</button>
          <ng-container [ngTemplateOutlet]="viewToggle"></ng-container>
        </div>
      </section>
    }

    <p-confirmpopup></p-confirmpopup>

    @if (!showcase) {
    <div class="mx-3 mb-2 flex flex-wrap items-center gap-2">
      <span class="rounded-md px-2.5 py-1 font-mono text-xs" [ngClass]="countBadge(getCardCount(mainDeck, 'Deck') === 50)">
        Main {{ getCardCount(mainDeck, 'Deck') }}/50
      </span>
      <span class="rounded-md px-2.5 py-1 font-mono text-xs" [ngClass]="countBadge(getCardCount(mainDeck, 'Egg') <= 5)">
        Egg {{ getCardCount(mainDeck, 'Egg') }}/5
      </span>
      @if (displaySideDeck()) {
        <span class="rounded-md bg-ink-2 px-2.5 py-1 font-mono text-xs text-fg">Side {{ getCardCount(sideDeck, 'All') }}</span>
      }
      <button
        type="button"
        (click)="shareImage()"
        class="ml-auto hidden h-9 items-center gap-2 rounded-lg border border-line bg-ink-2 px-3 text-sm font-semibold text-fg hover:border-accent lg:inline-flex">
        <i class="pi pi-image"></i> Share image
      </button>
      <button
        type="button"
        (click)="togglePool.emit()"
        [attr.aria-pressed]="!poolVisible"
        class="hidden h-9 items-center gap-2 rounded-lg border border-line bg-ink-2 px-3 text-sm font-semibold text-fg hover:border-accent lg:inline-flex">
        <i [class]="poolVisible ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
        {{ poolVisible ? 'Hide pool' : 'Show pool' }}
      </button>
      <ng-container [ngTemplateOutlet]="viewToggle"></ng-container>
    </div>
    }

    <ng-container>
      <p-accordion class="mx-auto" [multiple]="true" [(value)]="accordionValue">
        <p-accordion-panel value="0" [pDroppable]="['toDeck', 'fromSide']" (onDrop)="drop(draggedCard(), 'Main')">
          <p-accordion-header>
            <div>
              {{ 'Main-Deck (' + getCardCount(mainDeck, 'Egg') + '/5 - ' + getCardCount(mainDeck, 'Deck') + '/50)' }}
            </div>
          </p-accordion-header>
          <p-accordion-content>
            @if (listView) {
              <div class="flex flex-col gap-3">
                @for (group of groups; track group.title) {
                  <div class="flex flex-col gap-1">
                    @if (group.title) {
                      <div class="flex justify-between px-1 py-1">
                        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ group.title }}</span>
                        <span class="font-mono text-xs text-muted">{{ group.count }}</span>
                      </div>
                    }
                    <div class="grid grid-cols-[repeat(auto-fill,minmax(19rem,1fr))] gap-1">
                    @for (card of group.cards; track card.id) {
                      <div
                        pDraggable="fromDeck"
                        (onDragStart)="setDraggedCard(card, DRAG.Main)"
                        class="flex items-center gap-3 rounded-lg bg-ink-2 py-1 pl-1 pr-2">
                        <img [digimonImgFallback]="card.cardImage" alt="" class="h-11 w-8 rounded object-cover" />
                        <span class="flex min-w-0 flex-1 flex-col">
                          <span class="truncate text-sm font-medium text-fg">{{ card.name.english }}</span>
                          <span class="font-mono text-[11px] text-muted">{{ card.cardNumber }}</span>
                        </span>
                        @if (missingCards && card.count - getCardHave(card) > 0) {
                          <span class="rounded bg-orange-400/15 px-1.5 py-0.5 font-mono text-[11px] text-orange-300">need {{ card.count - getCardHave(card) }}</span>
                        }
                        <button type="button" [attr.aria-label]="'Remove one ' + card.name.english" (click)="websiteStore.removeCardFromDeck(card.id)"
                          class="h-8 w-8 rounded-md border border-line bg-ink-1 text-fg hover:border-accent">−</button>
                        <span class="w-5 text-center font-mono font-semibold text-fg">{{ card.count }}</span>
                        <button type="button" [attr.aria-label]="'Add one ' + card.name.english" (click)="websiteStore.addCardToDeck(card.id)"
                          class="h-8 w-8 rounded-md border border-line bg-ink-1 text-fg hover:border-accent">+</button>
                      </div>
                    }
                    </div>
                  </div>
                } @empty {
                  <p class="m-0 p-2 text-sm text-muted">Click or drag cards from the pool to add them.</p>
                }
              </div>
            } @else {
              <!-- Showcase (pool hidden on a wide screen): Digimon fill a wide column, Digi-Egg / Tamer / Option stack beside it.
                   Narrow screens hide the pool too (mobile Deck tab), but keep the stacked layout. -->
              <div [ngClass]="!showcase ? 'flex flex-col gap-4' : 'grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-8 gap-y-4'">
                @for (group of groups; track group.title) {
                  <section class="flex min-w-0 flex-col gap-1" [ngClass]="!showcase ? '' : sectionPlacement(group.title)">
                    @if (group.title) {
                      <div class="flex justify-between border-b border-line px-1 pb-1">
                        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ group.title }}</span>
                        <span class="font-mono text-xs text-muted">{{ group.count }}</span>
                      </div>
                    }
                    <div [ngClass]="!showcase ? 'grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))]' : 'flex flex-wrap'">
                      <digimon-deck-card
                        *ngFor="let card of group.cards"
                        [class.w-36]="showcase"
                        pDraggable="fromDeck"
                        (onDragStart)="setDraggedCard(card, DRAG.Main)"
                        (removeCard)="removeCard(card)"
                        [cardHave]="getCardHave(card)"
                        [card]="card"
                        [missingCards]="missingCards"></digimon-deck-card>
                    </div>
                  </section>
                } @empty {
                  <p class="m-0 p-2 text-sm text-muted">Click or drag cards from the pool to add them.</p>
                }
              </div>
            }
          </p-accordion-content>
        </p-accordion-panel>
        <p-accordion-panel
          value="1"
          *ngIf="displaySideDeck()"
          [pDroppable]="['toDeck', 'fromDeck']"
          (onDrop)="drop(draggedCard(), 'Side')">
          <p-accordion-header>{{ 'Side-Deck (' + getCardCount(sideDeck, 'All') + ')' }}</p-accordion-header>
          <p-accordion-content>
            <div class="grid w-full grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))]">
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
          </p-accordion-content>
        </p-accordion-panel>
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
    ImgFallbackDirective,
    NgTemplateOutlet,
  ],
  providers: [MessageService],
})
export class DeckViewComponent {
  @Input() collectionView: boolean;

  @Output() onMainDeck = new EventEmitter<IDeckCard[]>();
  @Output() hideStats = new EventEmitter<boolean>();
  @Output() togglePool = new EventEmitter<void>();
  @Input() poolVisible = true;
  // Pool hidden on a wide screen: hero header instead of the editing header
  @Input() showcase = false;

  mongoBackendService = inject(MongoBackendService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  saveStore = inject(SaveStore);
  private dialogStore = inject(DialogStore);
  websiteStore = inject(WebsiteStore);
  digimonCardStore = inject(DigimonCardStore);

  displaySideDeck = this.saveStore.displaySideDeck;

  mainDeck: IDeckCard[] = [];
  groups: DeckCardGroup[] = [];
  listView = false;
  accordionValue: string[] = ['0', '1'];
  sideDeck: IDeckCard[] = [];

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
    this.groups = deckGroups(this.mainDeck, this.saveStore.settings().groupDeckByType !== false);
  }

  shareImage() {
    this.dialogStore.updateExportDeckDialog({ show: true, deck: this.deck(), mode: 'IMAGE' });
  }

  sectionPlacement(title: string): string {
    if (!title) return 'col-span-2';
    return title === 'Digimon' ? 'col-start-1 row-start-1 row-span-4' : 'col-start-2 w-[28.5rem] max-w-full';
  }

  leadImage(): string | undefined {
    return this.digimonCardStore.cardsMap().get(this.deck().imageCardId)?.cardImage ?? this.mainDeck[0]?.cardImage;
  }

  countBadge(ok: boolean): string {
    return ok ? 'bg-green-500/15 text-green-300' : 'bg-ink-2 text-fg';
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
