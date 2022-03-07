import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {filter, Subject, takeUntil} from "rxjs";
import {ICard, ICollectionCard} from "../../models";
import {selectCollectionMode, selectFilteredDigimonCards, selectSave} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, OnDestroy {
  private cards$ = this.store.select(selectFilteredDigimonCards);
  private cards: ICard[] = []
  public cardsToShow: ICard[] = [];

  private save$ = this.store.select(selectSave)
  private collection: ICollectionCard[] = [];
  public gridCols = 'grid-cols-8';
  public collectionMode$ = this.store.select(selectCollectionMode);

  length = 100;
  pageSize = 25;
  pageSizeOptions: number[] = [25, 50, 100];

  private destroy$ = new Subject();

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.cards$.pipe(takeUntil(this.destroy$), filter(value => !!value))
      .subscribe(cards => {
        this.length = cards.length;
        this.cardsToShow = cards.slice(0, 25);
        this.cards = cards
      });

    this.save$
      .pipe(takeUntil(this.destroy$), filter(value => !!value))
      .subscribe(save => {
        this.collection = save.collection;
        this.gridCols = save.settings.cardSize ? `grid-cols-${save.settings.cardSize}` : 'grid-cols-8';
      });
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }

  public getCount(cardId: string): number {
    return this.collection.find(value => value.id === cardId)?.count ?? 0;
  }

  onPageChange($event: any) {
    this.cardsToShow =  this.cards.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize);
  }
}
