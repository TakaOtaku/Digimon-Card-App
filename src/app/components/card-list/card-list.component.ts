import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {addToDeck} from 'src/app/store/digimon.actions';
import {ICard, ICountCard} from "../../models";
import {selectCardListViewModel} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, OnDestroy {
  @Input() public deckBuilder = false;
  @Input() public showCount = 100;

  private cards: ICard[] = [];
  public cardsToShow: ICard[] = [];

  private collection: ICountCard[] = [];
  collectionMode = true;

  private destroy$ = new Subject();

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.select(selectCardListViewModel).pipe(takeUntil(this.destroy$))
      .subscribe(({cards, collection, collectionMode}) => {
        this.cards = this.deckBuilder ? cards.filter(card => card.version === 'Normal') : cards;
        this.cardsToShow = this.cards.slice(0, this.showCount);
        this.collectionMode = this.deckBuilder ? false : collectionMode;
        this.collection = collection;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  getCount(cardId: string): number {
    return this.collection.find(value => value.id === cardId)?.count ?? 0;
  }

  showMore() {
    const length = this.cardsToShow.length;
    this.cardsToShow = this.cards.slice(0, length + this.showCount);
  }

  addToDeck(card: ICard) {
    if (this.deckBuilder) {
      const countCard = {id: card.cardNumber, count: 1};
      this.store.dispatch(addToDeck({card: countCard}));
    }
  }
}
