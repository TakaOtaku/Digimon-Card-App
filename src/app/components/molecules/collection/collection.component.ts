import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { ICard, ICountCard } from "../../../../models";

interface MappedCollection {
  id: string;
  name: string;
  count: number;
  rarity: string;
}

@Component({
  selector: 'digimon-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})
export class CollectionComponent implements OnInit, OnChanges {
  @Input() collection: ICountCard[];
  @Input() allCards: ICard[];

  selectedSet = '';
  showCollection = false;
  collectionList: MappedCollection[] = [];
  mappedCollection: MappedCollection[];

  ngOnInit(): void {
    this.mappedCollection = this.collection.map((countCard) => {
      const foundCard = this.allCards.find((card) => card.id === countCard.id);
      return {
        id: countCard.id,
        name: foundCard?.name ?? 'Not Found',
        count: countCard.count,
        rarity: foundCard?.rarity ?? '',
      };
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['collection']) {
      this.mappedCollection = this.collection.map((countCard) => {
        const foundCard = this.allCards.find(
          (card) => card.id === countCard.id
        );
        return {
          id: countCard.id,
          name: foundCard?.name ?? 'Not Found',
          count: countCard.count,
          rarity: foundCard?.rarity ?? '',
        };
      });
    }
  }

  switch(set: string) {
    this.showCollection = true;
    this.collectionList = this.mappedCollection
      .filter((card) => {
        if (set === 'P') {
          return card.rarity === 'P';
        }
        return card.id.includes(set);
      })
      .sort(function (a, b) {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      });
  }

  setSelectedSet(value: string) {
    if (value === 'P') {
      this.switch('P');
    }

    this.selectedSet = value;
    if (!value) {
      this.collectionList = [];
    }
  }
}
