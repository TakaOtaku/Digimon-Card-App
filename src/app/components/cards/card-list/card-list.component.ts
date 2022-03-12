import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {ICard, ICollectionCard} from "../../../models";
import {selectCardListViewModel} from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, OnDestroy {
  @Input() public deckBuilder = false;

  cards: ICard[] = []

  private collection: ICollectionCard[] = [];
  collectionMode = true;

  private destroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(selectCardListViewModel).pipe(takeUntil(this.destroy$))
      .subscribe(({cards, collection, collectionMode}) => {
        this.cards = cards;
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
}
