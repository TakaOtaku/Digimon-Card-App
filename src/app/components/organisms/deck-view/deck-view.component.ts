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
import { filter, Subject, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import {
  DeckColorMap,
  ICard,
  ICountCard,
  IDeck,
  IDeckCard,
  ISave,
  tagsList,
} from '../../../../models';
import { ITag } from '../../../../models/interfaces/tag.interface';
import {
  compareIDs,
  deckIsValid,
  mapToDeckCards,
  sortColors,
} from '../../../functions/digimon-card.functions';
import { AuthService } from '../../../service/auth.service';
import { DatabaseService } from '../../../service/database.service';
import {
  addCardToDeck,
  importDeck,
  setDeck,
} from '../../../store/digimon.actions';
import {
  selectAddCardToDeck,
  selectCollection,
  selectDeckBuilderViewModel,
  selectSave,
} from '../../../store/digimon.selectors';
import { emptyDeck } from '../../../store/reducers/digimon.reducers';

@Component({
  selector: 'digimon-deck-view',
  templateUrl: './deck-view.component.html',
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
    color: { name: 'White', img: 'assets/decks/white.svg' },
    cards: [],
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
    private db: DatabaseService,
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
          this.db.shareDeck(this.deck, this.authService.userData);
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
   * Clear all Cards in the Deck
   */
  delete() {
    this.confirmationService.confirm({
      key: 'Delete',
      message:
        'You are about to clear all cards in the deck and make a new one. Are you sure?',
      accept: () => {
        this.mainDeck = [];
        const deck: IDeck = emptyDeck;
        this.store.dispatch(setDeck({ deck }));
        this.messageService.add({
          severity: 'success',
          summary: 'Deck cleared!',
          detail: 'Deckcards were cleared successfully!',
        });
      },
    });
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
    this.setTags();
    this.setColors();
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
      .sort((a, b) => sortColors(a.color, b.color) || a.id.localeCompare(b.id));

    const red = this.mainDeck
      .filter(
        (card) => card.color.startsWith('Red') && card.cardType === 'Digimon'
      )
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );
    const blue = this.mainDeck
      .filter(
        (card) => card.color.startsWith('Blue') && card.cardType === 'Digimon'
      )
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );
    const yellow = this.mainDeck
      .filter(
        (card) => card.color.startsWith('Yellow') && card.cardType === 'Digimon'
      )
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );
    const green = this.mainDeck
      .filter(
        (card) => card.color.startsWith('Green') && card.cardType === 'Digimon'
      )
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );
    const black = this.mainDeck
      .filter(
        (card) => card.color.startsWith('Black') && card.cardType === 'Digimon'
      )
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );
    const purple = this.mainDeck
      .filter(
        (card) => card.color.startsWith('Purple') && card.cardType === 'Digimon'
      )
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );

    const white = this.mainDeck
      .filter(
        (card) => card.color.startsWith('White') && card.cardType === 'Digimon'
      )
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );

    const tamer = this.mainDeck
      .filter((card) => card.cardType === 'Tamer')
      .sort((a, b) => sortColors(a.color, b.color) || a.id.localeCompare(b.id));

    const options = this.mainDeck
      .filter((card) => card.cardType === 'Option')
      .sort((a, b) => sortColors(a.color, b.color) || a.id.localeCompare(b.id));

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
      .sort((a, b) => sortColors(a.color, b.color) || a.id.localeCompare(b.id));

    const lv0 = this.mainDeck
      .filter((card) => card.cardLv === '' && card.cardType === 'Digimon')
      .sort((a, b) => sortColors(a.color, b.color) || a.id.localeCompare(b.id));

    const lv3 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.3')
      .sort((a, b) => sortColors(a.color, b.color) || a.id.localeCompare(b.id));
    const lv4 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.4')
      .sort((a, b) => sortColors(a.color, b.color) || a.id.localeCompare(b.id));
    const lv5 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.5')
      .sort((a, b) => sortColors(a.color, b.color) || a.id.localeCompare(b.id));
    const lv6 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.6')
      .sort((a, b) => sortColors(a.color, b.color) || a.id.localeCompare(b.id));
    const lv7 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.7')
      .sort((a, b) => sortColors(a.color, b.color) || a.id.localeCompare(b.id));

    const tamer = this.mainDeck
      .filter((card) => card.cardType === 'Tamer')
      .sort((a, b) => sortColors(a.color, b.color) || a.id.localeCompare(b.id));

    const options = this.mainDeck
      .filter((card) => card.cardType === 'Option')
      .sort((a, b) => sortColors(a.color, b.color) || a.id.localeCompare(b.id));

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

  private setTags() {
    this.tags = [];

    this.tags.push(this.setNewestSet(this.deck.cards));

    if (this.bannedCardsIncluded(this.deck.cards)) {
      this.tags.push({ name: 'Illegal', color: 'Primary' });
    }

    if (this.tooManyRestrictedCardsIncluded(this.deck.cards)) {
      if (!this.tags.find((tag) => tag.name === 'Illegal')) {
        this.tags.push({ name: 'Illegal', color: 'Primary' });
      }
    }
  }

  private setNewestSet(cards: ICountCard[]): ITag {
    const releaseOrder = [
      'BT11',
      'EX3',
      'BT10',
      'BT9',
      'EX2',
      'BT8',
      'BT7',
      'EX1',
      'BT6',
      'BT5',
      'BT4',
      'BT3',
      'BT2',
      'BT1',
    ];
    let set = '';
    releaseOrder.forEach((value) => {
      if (set) {
        return;
      }
      if (cards.find((card) => card.id.includes(value))) {
        set = value;
      }
    });
    return (
      tagsList.find((tag) => tag.name === set) ?? { name: '', color: 'Primary' }
    );
  }

  private bannedCardsIncluded(cards: ICountCard[]): boolean {
    let banned = false;
    cards.forEach((card) => {
      if (banned) {
        return;
      }

      const foundCard = this.allCards.find((allCard) => allCard.id === card.id);
      if (foundCard) {
        banned = foundCard.restriction === 'Banned';
      }
    });
    return banned;
  }

  private tooManyRestrictedCardsIncluded(cards: ICountCard[]): boolean {
    let restricted = false;
    cards.forEach((card) => {
      if (restricted) {
        return;
      }

      const foundCard = this.allCards.find((allCard) => allCard.id === card.id);
      if (foundCard) {
        const res = foundCard.restriction === 'Restricted to 1';
        restricted = res ? card.count > 1 : false;
      }
    });
    return restricted;
  }

  private setColors() {
    const cards: IDeckCard[] = mapToDeckCards(this.deck.cards, this.allCards);
    const colorArray = [
      { name: 'Red', count: 0 },
      { name: 'Blue', count: 0 },
      { name: 'Yellow', count: 0 },
      { name: 'Green', count: 0 },
      { name: 'Black', count: 0 },
      { name: 'Purple', count: 0 },
      { name: 'White', count: 0 },
    ];
    cards.forEach((card) => {
      colorArray.forEach((color, index) => {
        if (card.color.includes(color.name)) {
          colorArray[index].count += card.count;
        }
      });
    });

    const highest = colorArray.reduce((prev, current) =>
      prev.count > current.count ? prev : current
    );
    this.selectedColor = DeckColorMap.get(highest.name);
  }

  /**
   * Remove the card from the deck
   */
  removeCard(card: IDeckCard) {
    this.mainDeck = this.mainDeck.filter((value) => value !== card);
    this.mapToDeck();
  }
}
