import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ConfirmationService, MessageService} from "primeng/api";
import {filter, Subject, takeUntil} from "rxjs";
import { tagsList } from 'src/models/tags.data';
import * as uuid from "uuid";
import {ICard, ICountCard, IDeck, IDeckCard} from "../../../models";
import {ITag} from "../../../models/interfaces/tag.interface";
import {AuthService} from "../../service/auth.service";
import {DatabaseService} from "../../service/database.service";
import {importDeck, setDeck, setEdit} from "../../store/digimon.actions";
import {selectCollection, selectDeckBuilderViewModel, selectEdit} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.scss']
})
export class DeckBuilderComponent implements OnInit, OnDestroy {
  @Input() public mobile: boolean;

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

  tags: ITag[];
  tagsList: ITag[] = tagsList;
  filteredTags: ITag[];

  cardCount: number;

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
  allCards: ICard[] = [];

  public collection: ICountCard[];

  fullCards = true;
  edit = true;

  public stack = false;
  public missingCards = false;

  exportDialog = false;
  importDialog = false;
  statDialog = false;
  settingsDialog = false;
  accessoryDialog = false;

  private onDestroy$ = new Subject();

  constructor(
    private store: Store,
    private db: DatabaseService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.store.select(selectCollection).pipe(takeUntil(this.onDestroy$), filter(value => !!value))
      .subscribe(collection => this.collection = collection);
    this.store.select(selectDeckBuilderViewModel).pipe(takeUntil(this.onDestroy$), filter(value => !!value))
      .subscribe(({deck, cards}) => {
        this.allCards = cards;
        if (deck) {
          this.deck = deck;
          this.title = deck.title ?? '';
          this.description = deck.description ?? '';
          this.tags = deck.tags ?? [];
          this.mapDeck(deck);
        }
      });

    this.store.select(selectEdit).pipe(takeUntil(this.onDestroy$)).subscribe(edit => this.edit = edit);

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

    iDeckCards.forEach(card => this.mainDeck.push({...card, count: card.count}));
    this.deckSort();
  }

  switchFullOrSmallCards() {
    this.fullCards = !this.fullCards;
  }

  switchStack() {
    this.stack = !this.stack;
  }

  editView() {
    this.store.dispatch(setEdit({edit: !this.edit}))
  }

  share() {
    this.mapToDeck();

    this.cardCount = this.getCardCount('Main');

    this.accessoryDialog = true;
  }

  delete() {
    this.confirmationService.confirm({
      key: 'DeleteDeck',
      message: 'You are about to clear all cards in the deck and make a new one. Are you sure?',
      accept: () => {
        this.mainDeck = [];
        const deck: IDeck = {
          id: uuid.v4(),
          cards: [],
          color: {name: 'White', img: 'assets/decks/white.svg'}
        }
        this.store.dispatch(setDeck({deck}));
        this.messageService.add({severity:'success', summary:'Deck cleared!', detail:'Deckcards were cleared successfully!'});
      }
    });
  }

  save(){
    this.confirmationService.confirm({
      message: 'You are about to save all changes and overwrite everything changed. Are you sure?',
      accept: () => {
        this.mapToDeck();
        this.store.dispatch(importDeck({deck: this.deck}));
        this.messageService.add({severity:'success', summary:'Deck saved!', detail:'Deck was saved successfully!'});
      }
    });

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
      alreadyInDeck.count = alreadyInDeck.count + 1;
      return;
    }
    const card = this.allCards.find(card => card.cardNumber === id);
    this.mainDeck.push({...card!, count: 1});
    this.deckSort();
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
    this.deckSort();
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

  deckSort() {
    const eggs = this.mainDeck.filter(card => card.cardType === 'Digi-Egg').sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    const digimon = this.mainDeck.filter(card => card.cardType === 'Digimon').sort((a, b) => {
      const aa: number = +a.cardLv[3];
      const bb: number = +b.cardLv[3];
      if (aa < bb) {
        return -1;
      }
      if (aa > bb) {
        return 1;
      }
      return 0;
    });
    const tamer = this.mainDeck.filter(card => card.cardType === 'Tamer').sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    const options = this.mainDeck.filter(card => card.cardType === 'Option').sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    this.mainDeck = [...new Set([...eggs, ...digimon, ...tamer, ...options])]
  }

  getCardHave(card: IDeckCard) {
    const foundCards = this.collection.filter(colCard => colCard.id === card.cardNumber)
    let count = 0;
    foundCards?.forEach(found => {
      count += found.count;
    });
    return count;
  }

  filterTags(event: any) {
    let filtered : ITag[] = [];
    let query = event.query;

    for(let i = 0; i < this.tagsList.length; i++) {
      let tag = this.tagsList[i];
      if (tag.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tag);
      }
    }

    this.filteredTags = filtered;
  }

}
