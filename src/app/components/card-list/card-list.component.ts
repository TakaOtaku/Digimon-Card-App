import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {PromotionCardList} from "../../../assets/cardlists";
import {ICard, ICountCard} from "../../../models";
import {selectCollection, selectCollectionMode, selectFilteredCards} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, OnDestroy {
  @Input() public deckBuilder? = false;
  @Input() public showCount: number;

  @Output() onCardClick = new EventEmitter<string>();

  public cards: ICard[] = [];
  public cardsToShow: ICard[] = [];

  private collection: ICountCard[] = [];
  collectionMode = true;

  viewCard: ICard = PromotionCardList[0];
  viewCardDialog = false;
  cardContext = [
    {
      label:'View',
      icon:'pi pi-fw pi-info-circle',
      command: () => this.viewCardDialog = true
    }
  ];

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(selectFilteredCards).pipe(takeUntil(this.onDestroy$))
      .subscribe((cards) => {
        const filteredCards = cards.filter(card => card.version === 'Normal');
        this.cards = this.deckBuilder ? filteredCards : cards;
        this.cardsToShow = this.cards.slice(0, this.showCount);
      });
    this.store.select(selectCollection).pipe(takeUntil(this.onDestroy$))
      .subscribe((collection) => {
        this.collection = collection;
      });
    this.store.select(selectCollectionMode).pipe(takeUntil(this.onDestroy$))
      .subscribe((collectionMode) => {
        this.collectionMode = collectionMode;
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

  onContextMenu(card: ICard) {
    this.viewCard = card;
  }
}
