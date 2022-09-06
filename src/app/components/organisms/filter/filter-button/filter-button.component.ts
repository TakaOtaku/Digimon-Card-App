import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subject, takeUntil } from 'rxjs';
import { ICard, IDeck, IDeckCard, ISave } from '../../../../../models';
import {
  compareIDs,
  sortColors,
} from '../../../../functions/digimon-card.functions';
import { setDeck } from '../../../../store/digimon.actions';
import {
  selectAllCards,
  selectDeckBuilderViewModel,
  selectSave,
} from '../../../../store/digimon.selectors';

@Component({
  selector: 'digimon-filter-button',
  templateUrl: './filter-button.component.html',
})
export class FilterButtonComponent implements OnInit, OnDestroy {
  mainDeck: IDeckCard[];
  deck: IDeck;
  save: ISave;

  sidebar = false;

  private allCards: ICard[];
  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select(selectSave)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((value) => !!value)
      )
      .subscribe((save) => (this.save = save));

    this.store
      .select(selectAllCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allCards: ICard[]) => (this.allCards = allCards));

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
          this.mapDeck(deck);
        }
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

  /**
   * Map given Deck to Deck from IDeckCards
   */
  mapDeck(deck: IDeck) {
    this.mainDeck = [];
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
   * Update the Cards, Title and Description of the Deck
   */
  mapToDeck() {
    const cards = this.mainDeck.map((card) => ({
      id: card.id,
      count: card.count,
    }));
    this.deck = {
      ...this.deck,
      cards,
    };
    this.store.dispatch(setDeck({ deck: this.deck }));
    this.deckSort();
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

  private colorSort() {
    const eggs = this.mainDeck
      .filter((card) => card.cardType === 'Digi-Egg')
      .sort((a, b) => sortColors(a.color, b.color) || a.id.localeCompare(b.id));

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

    const multi = this.mainDeck
      .filter((card) => card.color.includes('/') && card.cardType === 'Digimon')
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
        ...multi,
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
}
