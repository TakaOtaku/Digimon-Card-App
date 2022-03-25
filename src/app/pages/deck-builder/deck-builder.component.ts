import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {ConfirmationService} from "primeng/api";
import {filter, Subject, takeUntil} from "rxjs";
import * as uuid from "uuid";
import {ICard, ICountCard, IDeck, IDeckCard} from "../../../models";
import {dynamicSort} from "../../functions/filter.functions";
import {importDeck, setDeck, setDecks} from "../../store/digimon.actions";
import {selectDeckBuilderViewModel} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.scss']
})
export class DeckBuilderComponent implements OnInit, OnDestroy {
  public mainDeck: IDeckCard[] = [];
  public sideDeck: IDeckCard[] = [];

  colorMap = new Map<string, string>([
    ['Red', '#e7002c'],
    ['Blue', '#0097e1'],
    ['Yellow', '#fee100'],
    ['Green', '#009c6b'],
    ['Black', '#211813'],
    ['Purple', '#6555a2'],
    ['White', '#ffffff'],
  ]);

  levelData: any;
  chartOptions: any = {
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      }
    }
  };

  title: string = '';
  description: string = '';

  public deck: IDeck = {id: uuid.v4(), color: {name: 'White', img: 'assets/decks/white.svg'}, cards: []};
  private allCards: ICard[] = [];

  public fullCards = true;

  public stack = false;

  exportDialog = false;
  importDialog = false;
  statDialog = false;

  private onDestroy$ = new Subject();

  constructor(
    private store: Store,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.store.select(selectDeckBuilderViewModel).pipe(takeUntil(this.onDestroy$), filter(value => !!value))
      .subscribe(({deck, cards}) => {
        this.allCards = cards;
        if (deck) {
          this.deck = deck;
          this.title = deck.title ?? '';
          this.description = deck.description ?? '';
          this.mapDeck(deck);
        }
      });

    this.getLevelStats();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  mapDeck(deck: IDeck) {
    this.mainDeck = [];
    this.sideDeck = [];
    const iDeckCards: IDeckCard[] = [];

    deck.cards.forEach(card => {
      const foundCard = this.allCards.find(item => item.id === card.id);
      if (foundCard) {
        iDeckCards.push({...foundCard, count: card.count});
      }
    });

    const sortedCards = iDeckCards.sort(dynamicSort('cardLv'));
    sortedCards.forEach(card => this.mainDeck.push({...card, count: card.count}));
  }

  switchFullOrSmallCards() {
    this.fullCards = !this.fullCards;
  }

  switchStack() {
    this.stack = !this.stack;
  }

  stats() {
    this.statDialog = true;
  }

  import() {
    this.importDialog = true;
  }

  share() {}

  export() {
    this.exportDialog = true;
  }

  delete() {
    this.confirmationService.confirm({
      key: 'DeleteDeck',
      message: 'You are about to clear all cards in the deck. This is not permanent until you save. Are you sure?',
      accept: () => {
        this.mainDeck = [];
        const deck: IDeck = {
          id: uuid.v4(),
          cards: [],
          color: {name: 'White', img: 'assets/decks/white.svg'}
        }
        this.store.dispatch(setDeck({deck}));
      }
    });
  }

  save(){
    this.mapToDeck();
    this.store.dispatch(importDeck({deck: this.deck}));
  }

  mapToDeck() {
    const cards = this.mainDeck.map(card => {
      return {id: card.id, count: card.count} as ICountCard;
    });
    this.deck = {...this.deck, title: this.title, description: this.description, cards}
  }

  onCardClick(id: string) {
    const alreadyInDeck = this.mainDeck.find(value => value.cardNumber === id);
    if(alreadyInDeck) {
      alreadyInDeck.count = alreadyInDeck.count === 4 ? 4 : alreadyInDeck.count + 1;
      return;
    }
    const card = this.allCards.find(card => card.cardNumber === id);
    this.mainDeck.push({...card!, count: 1});

  }

  getCardCount(which: string): number {
    let count = 0;
    if(which === 'Egg') {
      this.mainDeck.forEach(card => {
        if (card.cardLv === 'Lv.2') {
          count += card.count
        }
      });
    } else {
      this.mainDeck.forEach(card => {
        if (card.cardLv !== 'Lv.2') {
          count += card.count
        }
      });
    }


    return count;
  }

  removeCard(card: IDeckCard) {
    this.mainDeck = this.mainDeck.filter(value => value !== card);
  }

  getLevelStats() {
    const red = this.getColorLevelStats('Red');
    const blue = this.getColorLevelStats('Blue');
    const yellow = this.getColorLevelStats('Yellow');
    const green = this.getColorLevelStats('Green');
    const black = this.getColorLevelStats('Black');
    const purple = this.getColorLevelStats('Purple');
    const white = this.getColorLevelStats('White');

    const datasets = []

    if (red.length > 0) datasets.push({
      type: 'bar',
      label: 'Red',
      backgroundColor: this.colorMap.get('Red'),
      data: red
    });
    if (blue.length > 0) datasets.push({
      type: 'bar',
      label: 'Blue',
      backgroundColor: this.colorMap.get('Blue'),
      data: blue
    });
    if (yellow.length > 0) datasets.push({
      type: 'bar',
      label: 'Yellow',
      backgroundColor: this.colorMap.get('Yellow'),
      data: yellow
    });
    if (green.length > 0) datasets.push({
      type: 'bar',
      label: 'Green',
      backgroundColor: this.colorMap.get('Green'),
      data: green
    });
    if (black.length > 0) datasets.push({
      type: 'bar',
      label: 'Black',
      backgroundColor: this.colorMap.get('Black'),
      data: black
    });
    if (purple.length > 0) datasets.push({
      type: 'bar',
      label: 'Purple',
      backgroundColor: this.colorMap.get('Purple'),
      data: purple
    });
    if (white.length > 0) datasets.push({
      type: 'bar',
      label: 'White',
      backgroundColor: this.colorMap.get('White'),
      data: white
    });

    this.levelData = {
      labels: ['Lv.2','Lv.3','Lv.4','Lv.5','Lv.6','Lv.7','Tamers','Options'],
      datasets: datasets
    };
  }

  getColorLevelStats(color: string): number[] {
    const cards = this.mainDeck.filter(card => card.color === color);
    const lv2 = this.getCountFromCardArray(cards.filter(card => card.cardLv === 'Lv.2'));
    const lv3 = this.getCountFromCardArray(cards.filter(card => card.cardLv === 'Lv.3'));
    const lv4 = this.getCountFromCardArray(cards.filter(card => card.cardLv === 'Lv.4'));
    const lv5 = this.getCountFromCardArray(cards.filter(card => card.cardLv === 'Lv.5'));
    const lv6 = this.getCountFromCardArray(cards.filter(card => card.cardLv === 'Lv.6'));
    const lv7 = this.getCountFromCardArray(cards.filter(card => card.cardLv === 'Lv.7'));
    const tamer = this.getCountFromCardArray(cards.filter(card => card.cardType === 'Tamer'));
    const option = this.getCountFromCardArray(cards.filter(card => card.cardType === 'Option'));
    return [lv2, lv3, lv4, lv5, lv6, lv7, tamer, option];
  }

  getCountFromCardArray(cards: IDeckCard[]): number {
    let count = 0;
    cards.forEach(card => count += card.count);
    return count;
  }
}
