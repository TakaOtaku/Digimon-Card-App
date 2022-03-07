import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {filter, Subject, takeUntil} from "rxjs";
import {ICollectionCard} from "../../models";
import {selectCollectionMode, selectFilteredDigimonCards, selectSave} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, OnDestroy {
  public cards$ = this.store.select(selectFilteredDigimonCards);

  private save$ = this.store.select(selectSave)
  private collection: ICollectionCard[] = [];
  public gridCols = 'grid-cols-8';
  public collectionMode$ = this.store.select(selectCollectionMode);

  private destroy$ = new Subject();

  constructor(private store: Store) {}

  public ngOnInit(): void {
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
}
