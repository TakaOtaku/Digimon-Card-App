import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {filter, Subject, takeUntil} from "rxjs";
import {dynamicSort} from "../../../functions/filter.functions";
import {ICard, IDeck, IDeckCard} from "../../../models";
import {selectDeckBuilderViewModel} from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.scss']
})
export class DeckBuilderComponent implements OnInit, OnDestroy {
  public eggs: IDeckCard[] = [];
  public mainDeck: IDeckCard[] = [];

  private deck: IDeck = {cards: []};
  private allCards: ICard[] = [];

  private onDestroy$ = new Subject();

  constructor(private store: Store) {
  }

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

  drop(event: CdkDragDrop<IDeckCard[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
