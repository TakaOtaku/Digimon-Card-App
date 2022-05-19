import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { filter, Subject, takeUntil } from 'rxjs';
import { tagsList } from 'src/models/tags.data';
import * as uuid from 'uuid';
import {
  ColorMap,
  ColorOrderMap,
  DeckColorMap,
  ICard,
  ICountCard,
  IDeck,
  IDeckCard,
  ISave,
} from '../../../models';
import { ITag } from '../../../models/interfaces/tag.interface';
import { Colors } from '../../components/filter-box/filterData';
import {
  compareIDs,
  deckIsValid,
} from '../../functions/digimon-card.functions';
import { AuthService } from '../../service/auth.service';
import { DatabaseService } from '../../service/database.service';
import {
  importDeck,
  setDeck,
  setExportDeckDialog,
  setImportDeckDialog,
} from '../../store/digimon.actions';
import {
  selectCollection,
  selectDeckBuilderViewModel,
  selectSave,
} from '../../store/digimon.selectors';
import { emptyDeck } from '../../store/reducers/digimon.reducers';

@Component({
  selector: 'digimon-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.scss'],
})
export class DeckBuilderComponent implements OnInit, OnDestroy {
  @Input() public mobile: boolean;

  title = '';
  description = '';
  tags: ITag[];

  mainDeck: IDeckCard[] = [];
  sideDeck: IDeckCard[] = [];

  deck: IDeck = {
    id: uuid.v4(),
    color: { name: 'White', img: 'assets/decks/white.svg' },
    cards: [],
  };

  colorMap = ColorMap;

  colors = Colors;
  colorFilter = new FormControl();

  tagsList: ITag[] = tagsList;
  filteredTags: ITag[];

  levelData: any;
  chartOptions: any = {
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
        },
      },
    },
  };

  allCards: ICard[] = [];
  collection: ICountCard[];
  save: ISave;

  fullCards = true;
  stack = false;
  missingCards = false;

  sidebar = false;
  statsSidebar = true;

  statDialog = false;

  fullscreen = false;

  private onDestroy$ = new Subject();

  constructor(
    private store: Store,
    private db: DatabaseService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  private static sortColors(colorA: string, colorB: string): number {
    const a: number = ColorOrderMap.get(colorA) ?? 0;
    const b: number = ColorOrderMap.get(colorB) ?? 0;
    return a - b;
  }

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
          this.colorFilter.setValue(deck.color.name);
          this.mapDeck(deck);
        }
      });

    this.getLevelStats();
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

    if (!this.deckIsValid(this.deck)) {
      return;
    }

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

  deckIsValid(deck: IDeck): boolean {
    const error = deckIsValid(deck, this.allCards);
    if (error !== '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Deck is not ready!',
        detail: error,
      });
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
      color: DeckColorMap.get(this.colorFilter.value),
      cards,
    };
    this.store.dispatch(setDeck({ deck: this.deck }));
    this.deckSort();
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
      if (card!.cardNumber === 'BT6-085' || card!.cardNumber === 'EX2-046') {
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
   * Get Count of how many Cards are in the Main-Deck or Egg Deck
   */
  getCardCount(which: string): number {
    let count = 0;
    if (which === 'Egg') {
      this.mainDeck.forEach((card) => {
        if (card.cardLv === 'Lv.2') {
          count += card.count;
        }
      });
    } else {
      this.mainDeck.forEach((card) => {
        if (card.cardLv !== 'Lv.2') {
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

  /**
   * Get Deck Level Stats for the Bar-Chart
   */
  getLevelStats() {
    const red = this.getColorLevelStats('Red');
    const blue = this.getColorLevelStats('Blue');
    const yellow = this.getColorLevelStats('Yellow');
    const green = this.getColorLevelStats('Green');
    const black = this.getColorLevelStats('Black');
    const purple = this.getColorLevelStats('Purple');
    const white = this.getColorLevelStats('White');

    const datasets = [];

    if (red.length > 0)
      datasets.push({
        type: 'bar',
        label: 'Red',
        backgroundColor: this.colorMap.get('Red'),
        data: red,
      });
    if (blue.length > 0)
      datasets.push({
        type: 'bar',
        label: 'Blue',
        backgroundColor: this.colorMap.get('Blue'),
        data: blue,
      });
    if (yellow.length > 0)
      datasets.push({
        type: 'bar',
        label: 'Yellow',
        backgroundColor: this.colorMap.get('Yellow'),
        data: yellow,
      });
    if (green.length > 0)
      datasets.push({
        type: 'bar',
        label: 'Green',
        backgroundColor: this.colorMap.get('Green'),
        data: green,
      });
    if (black.length > 0)
      datasets.push({
        type: 'bar',
        label: 'Black',
        backgroundColor: this.colorMap.get('Black'),
        data: black,
      });
    if (purple.length > 0)
      datasets.push({
        type: 'bar',
        label: 'Purple',
        backgroundColor: this.colorMap.get('Purple'),
        data: purple,
      });
    if (white.length > 0)
      datasets.push({
        type: 'bar',
        label: 'White',
        backgroundColor: this.colorMap.get('White'),
        data: white,
      });

    this.levelData = {
      labels: [
        'Lv.2',
        'Lv.3',
        'Lv.4',
        'Lv.5',
        'Lv.6',
        'Lv.7',
        'Tamers',
        'Options',
      ],
      datasets: datasets,
    };
  }

  getColorLevelStats(color: string): number[] {
    const cards = this.mainDeck.filter((card) => card.color === color);
    const lv2 = this.getCountFromCardArray(
      cards.filter((card) => card.cardLv === 'Lv.2')
    );
    const lv3 = this.getCountFromCardArray(
      cards.filter((card) => card.cardLv === 'Lv.3')
    );
    const lv4 = this.getCountFromCardArray(
      cards.filter((card) => card.cardLv === 'Lv.4')
    );
    const lv5 = this.getCountFromCardArray(
      cards.filter((card) => card.cardLv === 'Lv.5')
    );
    const lv6 = this.getCountFromCardArray(
      cards.filter((card) => card.cardLv === 'Lv.6')
    );
    const lv7 = this.getCountFromCardArray(
      cards.filter((card) => card.cardLv === 'Lv.7')
    );
    const tamer = this.getCountFromCardArray(
      cards.filter((card) => card.cardType === 'Tamer')
    );
    const option = this.getCountFromCardArray(
      cards.filter((card) => card.cardType === 'Option')
    );
    return [lv2, lv3, lv4, lv5, lv6, lv7, tamer, option];
  }

  getCountFromCardArray(cards: IDeckCard[]): number {
    let count = 0;
    cards.forEach((card) => (count += card.count));
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

  removeP(id: string): string {
    if (!id.includes('_P')) {
      return id;
    }
    return id.split('_P')[0];
  }

  /**
   * For the autocomplete, filter Tags to display
   */
  filterTags(event: any) {
    let filtered: ITag[] = [];
    let query = event.query;

    for (let i = 0; i < this.tagsList.length; i++) {
      let tag = this.tagsList[i];
      if (tag.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tag);
      }
    }

    this.filteredTags = filtered;
  }

  colorChecked(color: string): boolean {
    return this.colorFilter.value === color;
  }

  openImportDeckDialog() {
    this.store.dispatch(setImportDeckDialog({ show: true }));
  }

  openExportDeckDialog() {
    this.store.dispatch(setExportDeckDialog({ show: true, deck: this.deck }));
  }

  private colorSort() {
    const eggs = this.mainDeck
      .filter((card) => card.cardType === 'Digi-Egg')
      .sort(
        (a, b) =>
          DeckBuilderComponent.sortColors(a.color, b.color) ||
          a.id.localeCompare(b.id)
      );

    const red = this.mainDeck
      .filter((card) => card.color === 'Red' && card.cardType === 'Digimon')
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );
    const blue = this.mainDeck
      .filter((card) => card.color === 'Blue' && card.cardType === 'Digimon')
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );
    const yellow = this.mainDeck
      .filter((card) => card.color === 'Yellow' && card.cardType === 'Digimon')
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );
    const green = this.mainDeck
      .filter((card) => card.color === 'Green' && card.cardType === 'Digimon')
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );
    const black = this.mainDeck
      .filter((card) => card.color === 'Black' && card.cardType === 'Digimon')
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );
    const purple = this.mainDeck
      .filter((card) => card.color === 'Purple' && card.cardType === 'Digimon')
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );

    const white = this.mainDeck
      .filter((card) => card.color === 'White' && card.cardType === 'Digimon')
      .sort(
        (a, b) => a.cardLv.localeCompare(b.cardLv) || a.id.localeCompare(b.id)
      );

    const tamer = this.mainDeck
      .filter((card) => card.cardType === 'Tamer')
      .sort(
        (a, b) =>
          DeckBuilderComponent.sortColors(a.color, b.color) ||
          a.id.localeCompare(b.id)
      );

    const options = this.mainDeck
      .filter((card) => card.cardType === 'Option')
      .sort(
        (a, b) =>
          DeckBuilderComponent.sortColors(a.color, b.color) ||
          a.id.localeCompare(b.id)
      );

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
      .sort(
        (a, b) =>
          DeckBuilderComponent.sortColors(a.color, b.color) ||
          a.id.localeCompare(b.id)
      );

    const lv0 = this.mainDeck
      .filter((card) => card.cardLv === '' && card.cardType === 'Digimon')
      .sort(
        (a, b) =>
          DeckBuilderComponent.sortColors(a.color, b.color) ||
          a.id.localeCompare(b.id)
      );

    const lv3 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.3')
      .sort(
        (a, b) =>
          DeckBuilderComponent.sortColors(a.color, b.color) ||
          a.id.localeCompare(b.id)
      );
    const lv4 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.4')
      .sort(
        (a, b) =>
          DeckBuilderComponent.sortColors(a.color, b.color) ||
          a.id.localeCompare(b.id)
      );
    const lv5 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.5')
      .sort(
        (a, b) =>
          DeckBuilderComponent.sortColors(a.color, b.color) ||
          a.id.localeCompare(b.id)
      );
    const lv6 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.6')
      .sort(
        (a, b) =>
          DeckBuilderComponent.sortColors(a.color, b.color) ||
          a.id.localeCompare(b.id)
      );
    const lv7 = this.mainDeck
      .filter((card) => card.cardLv === 'Lv.7')
      .sort(
        (a, b) =>
          DeckBuilderComponent.sortColors(a.color, b.color) ||
          a.id.localeCompare(b.id)
      );

    const tamer = this.mainDeck
      .filter((card) => card.cardType === 'Tamer')
      .sort(
        (a, b) =>
          DeckBuilderComponent.sortColors(a.color, b.color) ||
          a.id.localeCompare(b.id)
      );

    const options = this.mainDeck
      .filter((card) => card.cardType === 'Option')
      .sort(
        (a, b) =>
          DeckBuilderComponent.sortColors(a.color, b.color) ||
          a.id.localeCompare(b.id)
      );

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
}
