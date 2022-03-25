import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {addToDeck} from 'src/app/store/digimon.actions';
import {ICard, ICountCard} from "../../../models";
import {selectCardListViewModel} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, OnDestroy {
  @Input() public deckBuilder? = false;
  @Input() public showCount: number;

  @Output() onCardClick = new EventEmitter<string>();

  private cards: ICard[] = [];
  public cardsToShow: ICard[] = [];

  private collection: ICountCard[] = [];
  collectionMode = true;

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(selectCardListViewModel).pipe(takeUntil(this.onDestroy$))
      .subscribe(({cards, collection, collectionMode}) => {
        this.cards = this.deckBuilder ? cards.filter(card => card.version === 'Normal') : cards;
        this.collection = collection;
        this.collectionMode = collectionMode;
        this.cardsToShow = this.cards.slice(0, this.showCount);
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  getCount(cardId: string): number {
    return this.collection.find(value => value.id === cardId)?.count ?? 0;
  }

  showMore() {
    const length = this.cardsToShow.length;
    this.cardsToShow = this.cards.slice(0, length + this.showCount!);
  }

  addToDeck(card: ICard) {
    if (this.deckBuilder) {
      this.onCardClick.emit(card.cardNumber)
    }
  }

  moreCardsThere(): boolean {
    return this.cards.length > this.cardsToShow.length && this.cardsToShow.length > 0;
  }
}
