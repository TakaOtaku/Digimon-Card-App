import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ICard, ICollectionCard} from "../../models";
import {selectCollection, selectDigimonCards} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
  public cards$ = this.store.select(selectDigimonCards);
  public collection$ = this.store.select(selectCollection);
  private collection: ICollectionCard[] = [];

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.collection$.subscribe((collection) => {
      console.log('Collection: ', collection);
      this.collection = collection;
    });
  }

  public getCount(card: ICard): number {
    const collectionCard = this.collection.find(value => value.id === card.id)
    return collectionCard ? collectionCard.count : 0
  }
}
