import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { filter, first, Subject, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import {
  ICard,
  ICountCard,
  IDeck,
  IDeckCard,
  ISave,
  ITag,
} from '../../../../models';
import { DeckColorMap } from '../../../../models/maps/color.map';
import {
  compareIDs,
  deckIsValid,
  setColors,
  setTags,
  sortColors,
} from '../../../functions/digimon-card.functions';
import { sortID } from '../../../functions/filter.functions';
import { AuthService } from '../../../service/auth.service';
import { DigimonBackendService } from '../../../service/digimon-backend.service';
import {
  addCardToDeck,
  importDeck,
  setDeck,
} from '../../../store/digimon.actions';
import {
  selectAddCardToDeck,
  selectCollection,
  selectCommunityDecks,
  selectDeckBuilderViewModel,
  selectSave,
} from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-deck-view',
  template: `
    <div class="mx-auto max-w-[760px]">
      <digimon-deck-metadata
        [(title)]="title"
        [(tags)]="tags"
        [(description)]="description"
        [(selectedColor)]="selectedColor"
      ></digimon-deck-metadata>

      <digimon-deck-toolbar
        [deck]="deck"
        [mainDeck]="mainDeck"
        [missingCards]="missingCards"
        (missingCardsChange)="missingCards = $event"
        (share)="share()"
        (save)="saveDeck($event)"
        (hideStats)="hideStats.emit(true)"
      ></digimon-deck-toolbar>
    </div>

    <div class="mx-auto h-full max-w-[1080px]">
      <div class="grid w-full grid-cols-4 pb-32 md:grid-cols-6 lg:grid-cols-8">
        <div *ngFor="let card of mainDeck">
          <digimon-deck-card
            (onChange)="mapToDeck()"
            (removeCard)="removeCard(card)"
            [cardHave]="getCardHave(card)"
            [card]="card"
            [cards]="allCards"
            [missingCards]="missingCards"
          ></digimon-deck-card>
        </div>
      </div>
    </div>
  `,
})
export class DeckViewComponent implements OnInit, OnDestroy {
  @Input() collectionView: boolean;
  @Output() onMainDeck = new EventEmitter<IDeckCard[]>();
  @Output() hideStats = new EventEmitter<boolean>();

  title = '';
  description = '';
  tags: ITag[];
  selectedColor: any;

  mainDeck: IDeckCard[] = [];
  sideDeck: IDeckCard[] = [];

  deck: IDeck = {
    id: uuid.v4(),
    title: '',
    description: '',
    date: new Date().toString(),
    color: { name: 'White', img: 'assets/decks/white.svg' },
    cards: [],
    tags: [],
    user: '',
    userId: '',
    imageCardId: 'BT1-001',
    likes: [],
  };

  allCards: ICard[] = [];
  collection: ICountCard[];
  save: ISave;

  fullCards = true;
  stack = false;
  missingCards = false;

  private onDestroy$ = new Subject();

  constructor(
    private store: Store,
    private digimonBackendService: DigimonBackendService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.store
      .select(selectSave)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((value) => !!value)
      )
      .subscribe((save) => (this.save = save));
    this.store
      .select(selectCollection)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((value) => !!value)
      )
      .subscribe((collection) => (this.collection = collection));
    this.store
      .select(selectDeckBuilderViewModel)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((value) => !!value)
      )
      .subscribe(({ deck, cards }) => {
        this.allCards = cards;
        if (deck && deck !== this.deck) {
          this.deck = deck;
          this.title = deck.title ?? '';
          this.description = deck.description ?? '';
          this.tags = deck.tags ?? [];
          this.selectedColor = deck.color;
          this.mapDeck(deck);
        }
      });

    this.store
      .select(selectAddCardToDeck)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((value) => !!value)
      )
      .subscribe((cardToAdd) => {
        this.onCardClick(cardToAdd);
        this.store.dispatch(addCardToDeck({ addCardToDeck: '' }));
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  /**
   * Map given Deck to Deck from IDeckCards
   */
  mapDeck(deck: IDeck) {
    this.mainDeck = [];
    this.sideDeck = [];
    const iDeckCards: IDeckCard[] = [];

    deck.cards.forEach((card) => {
      const foundCard = this.allCards.find((item) =>
        compareIDs(item.id, card.id)
      );
      if (foundCard) {
        iDeckCards.push({ ...foundCard, count: card.count });
      }
    });

    iDeckCards.forEach((card) =>
      this.mainDeck.push({ ...card, count: card.count })
    );
    this.deckSort();
  }

  /**
   * Open the accessory dialog
   */
  share() {
    this.mapToDeck();

    if (this.deckIsValid(this.deck)) {
      this.confirmationService.confirm({
        message: 'You are about to share the deck. Are you sure?',
        accept: () => {
          this.digimonBackendService
            .updateDeck(this.deck, this.authService.userData)
            .pipe(first())
            .subscribe(() => {});
          this.messageService.add({
            severity: 'success',
            summary: 'Deck shared!',
            detail: 'Deck was shared successfully!',
          });
        },
      });
    }
  }

  deckIsValid(deck: IDeck): boolean {
    const error = deckIsValid(deck, this.allCards);
    if (error !== '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Deck is not ready!',
        detail: error,
      });
      return false;
    }
    return true;
  }

  /**
   * Save the Deck
   */
  saveDeck(event: any) {
    this.confirmationService.confirm({
      target: event.target,
      message:
        'You are about to save all changes and overwrite everything changed. Are you sure?',
      accept: () => {
        this.mapToDeck();
        this.store.dispatch(importDeck({ deck: this.deck }));
        this.messageService.add({
          severity: 'success',
          summary: 'Deck saved!',
          detail: 'Deck was saved successfully!',
        });
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
    this.deck = {
      ...this.deck,
      title: this.title,
      description: this.description,
      tags: this.tags,
      color: DeckColorMap.get(this.selectedColor.name),
      cards,
    };
    this.store.dispatch(setDeck({ deck: this.deck }));
    this.deckSort();
    this.tags = setTags(this.tags, this.deck, this.allCards);
    this.selectedColor = setColors(
      this.deck,
      this.allCards,
      this.selectedColor
    );
    this.onMainDeck.emit(this.mainDeck);
  }

  /**
   * Increase the Card Count but check for Eosmon
   */
  onCardClick(id: string) {
    const alreadyInDeck = this.mainDeck.find((value) =>
      compareIDs(value.id, id)
    );
    const card = this.allCards.find((card) => compareIDs(card.id, id));
    if (alreadyInDeck) {
      if (
        card!.cardNumber === 'BT6-085' ||
        card!.cardNumber === 'EX2-046' ||
        card!.cardNumber === 'BT11-061'
      ) {
        alreadyInDeck.count =
          alreadyInDeck.count >= 50 ? 50 : alreadyInDeck.count + 1;
        this.mapToDeck();
        return;
      }
      alreadyInDeck.count =
        alreadyInDeck.count === 4 ? 4 : alreadyInDeck.count + 1;
      this.mapToDeck();
      return;
    }

    this.mainDeck.push({ ...card!, count: 1 });
    this.mapToDeck();
  }

  /**
   * Compare with the collection if you have all necessary Cards
   */
  getCardHave(card: IDeckCard) {
    const foundCards = this.collection.filter(
      (colCard) => this.removeP(colCard.id) === card.cardNumber
    );
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
    const colorSort = this.save.settings.sortDeckOrder === 'Color';
    if (colorSort) {
      this.colorSort();
    } else {
      this.levelSort();
    }
  }

  removeP(id: string): string {
    if (!id.includes('_P')) {
      return id;
    }
    return id.split('_P')[0];
  }

  private colorSort() {
    const eggs = this.mainDeck
      .filter((card) => card.cardType === 'Digi-Egg')
      .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

    const red = this.mainDeck
      .filter(
        (card) => card.color.startsWith('Red') && card.cardType === 'Digimon'
      )
      .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
    const blue = this.mainDeck
      .filter(
        (card) => card.color.startsWith('Blue') && card.cardType === 'Digimon'
      )
      .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
    const yellow = this.mainDeck
      .filter(
        (card) => card.color.startsWith('Yellow') && card.cardType === 'Digimon'
      )
      .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
    const green = this.mainDeck
      .filter(
        (card) => card.color.startsWith('Green') && card.cardType === 'Digimon'
      )
      .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
    const black = this.mainDeck
      .filter(
        (card) => card.color.startsWith('Black') && card.cardType === 'Digimon'
      )
      .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
    const purple = this.mainDeck
      .filter(
        (card) => card.color.startsWith('Purple') && card.cardType === 'Digimon'
      )
      .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));

    const white = this.mainDeck
      .filter(
        (card) => card.color.startsWith('White') && card.cardType === 'Digimon'
      )
      .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));

    const tamer = this.mainDeck
      .filter((card) => card.cardType === 'Tamer')
      .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

    const options = this.mainDeck
      .filter((card) => card.cardType === 'Option')
      .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

    this.mainDeck = [
      ...new Set([
        ...eggs,
        ...red,
        ...blue,
        ...yellow,
        ...green,
        ...black,
        ...purple,
        ...white,
        ...tamer,
        ...options,
      ]),
    ];
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

  /**
   * Remove the card from the deck
   */
  removeCard(card: IDeckCard) {
    this.mainDeck = this.mainDeck.filter((value) => value !== card);
    this.mapToDeck();
  }

  deckThingy() {
    this.store
      .select(selectCommunityDecks)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((decks) => {
        decks.forEach((deck) => {
          const newDeck = deck;

          if (deckIsValid(deck, this.allCards) === '') {
            newDeck.tags = setTags(deck.tags ?? [], deck, this.allCards);
            newDeck.color = setColors(deck, this.allCards, deck.color);
            this.digimonBackendService
              .updateDeck(newDeck)
              .pipe(first())
              .subscribe();
          } else {
            this.digimonBackendService
              .deleteDeck(deck.id)
              .pipe(first())
              .subscribe();
          }
        });
      });
  }
}
