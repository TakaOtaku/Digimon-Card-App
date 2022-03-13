import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {filter, Subject, takeUntil} from "rxjs";
import {ICard, IDeck} from "../../../models";
import {selectDeckBuilderViewModel} from "../../../store/digimon.selectors";

export interface IDeckBuilder {
  eggs: ICard[];
  mainDeck: ICard[];
  sideDeck: ICard[];
}

@Component({
  selector: 'digimon-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.scss']
})
export class DeckBuilderComponent implements OnInit, OnDestroy {
  public mappedDeck: IDeckBuilder = {
    eggs: [],
    mainDeck: [],
    sideDeck: []
  }
  public deck: IDeck = {cards: []};
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
          this.mappedDeck = this.mapDeck(deck);
        }
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  mapDeck(deck: IDeck): IDeckBuilder {
    const deckBuilder: IDeckBuilder = {eggs: [], mainDeck: [], sideDeck: []};
    deck.cards.forEach(card => {
      const completeCard = this.allCards.find(item => item.id === card.id);
      if (completeCard?.cardLv === 'Lv.2') {
        deckBuilder.eggs.push(completeCard);
      } else if (completeCard) {
        deckBuilder.mainDeck.push(completeCard);
      }
    });
    return deckBuilder;
  }

  drop(event: CdkDragDrop<ICard[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
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
