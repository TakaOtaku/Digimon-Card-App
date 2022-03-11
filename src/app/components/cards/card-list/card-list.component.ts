import {Component, OnDestroy, OnInit} from '@angular/core';
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
  private cards: ICard[] = []
  cardsToShow: ICard[] = [];

  private collection: ICollectionCard[] = [];
  collectionMode = true;

  length = 100;
  pageSize = 25;
  pageSizeOptions: number[] = [25, 50, 100];

  private destroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(selectCardListViewModel).pipe(takeUntil(this.destroy$))
      .subscribe(({cards, collection, collectionMode}) => {
        this.cards = cards;
        this.length = cards.length;
        this.cardsToShow = cards.slice(0, 25);

        this.collectionMode = collectionMode;

        this.collection = collection;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  getCount(cardId: string): number {
    return this.collection.find(value => value.id === cardId)?.count ?? 0;
  }

  onPageChange($event: any) {
    this.cardsToShow =  this.cards.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize);
  }
}
