import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {filter, Subject, takeUntil} from "rxjs";
import {dynamicSort} from "../../../functions/filter.functions";
import {ICard, IDeck, IDeckCard} from "../../../models";
import {setDeck} from "../../../store/digimon.actions";
import {selectDeckBuilderViewModel} from "../../../store/digimon.selectors";
import {ConfirmationDialogComponent} from "../../dialogs/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'digimon-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.scss']
})
export class DeckBuilderComponent implements OnInit, OnDestroy {
  public eggs: IDeckCard[] = [];
  public mainDeck: IDeckCard[] = [];
  public sideDeck: IDeckCard[] = [];

  public deck: IDeck = {cards: []};
  private allCards: ICard[] = [];

  public fullCards = true;
  public fullOrSmallCards = 'Full Cards';

  public stack = true;

  private onDestroy$ = new Subject();

  constructor(
    private store: Store,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.store.select(selectDeckBuilderViewModel).pipe(takeUntil(this.onDestroy$), filter(value => !!value))
      .subscribe(({deck, cards}) => {
        this.allCards = cards;
        if (deck) {
          this.deck = deck;
          this.mapDeck(deck);
        }
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  mapDeck(deck: IDeck) {
    this.mainDeck = [];
    this.eggs = [];
    this.sideDeck = [];
    const iDeckCards: IDeckCard[] = [];
    deck.cards.forEach(card => {
      const foundCard = this.allCards.find(item => item.id === card.id);
      if (foundCard) {
        iDeckCards.push({...foundCard, count: card.count});
      }
    });

    const sortedCards = iDeckCards.sort(dynamicSort('cardLv'));
    sortedCards.forEach(card => {
      if (card.cardLv === 'Lv.2') {
        this.eggs.push({...card, count: card.count});
      } else if (card) {
        this.mainDeck.push({...card, count: card.count});
      }
    });
  }

  switchFullOrSmallCards() {
    this.fullOrSmallCards = this.fullCards ? 'Small Cards' : 'Full Cards';
    this.fullCards = !this.fullCards;
  }

  switchStack() {
    this.stack = !this.stack;
  }

  stats() {}

  importExport() {}

  share() {}

  edit() {}

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Are you sure?",
        message: "You are about to permanently delete the cards in the deck."}
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
        this.store.dispatch(setDeck({deck: {...this.deck, cards: []}}));
      }
    });
  }

  getCardCount(cards: IDeckCard[]): number {
    let count = 0;
    cards.forEach(card => count += card.count);
    return count;
  }

  changeCardCount(event: number, cards: IDeckCard[], card: IDeckCard) {
    cards = cards.map(value => {
      if (value.id === card.id) {
        return {...card, count: event}
      }
      return value;
    });
  }
}
