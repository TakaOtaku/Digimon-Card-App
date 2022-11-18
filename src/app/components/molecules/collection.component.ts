import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ICard, ICountCard } from '../../../models';

interface MappedCollection {
  id: string;
  name: string;
  count: number;
  rarity: string;
}

@Component({
  selector: 'digimon-collection',
  template: `
    <div
      class="border-red h-[250px] overflow-y-scroll border-2 text-white lg:h-1/2"
    >
      <div
        class="primary-background h-12 w-full border-2 border-slate-500 text-center text-3xl font-bold"
      >
        Collection
      </div>

      <div class="mx-2 mt-2 flex h-full w-[calc(100%-1rem)] flex-col">
        <button
          (click)="setSelectedSet('')"
          *ngIf="selectedSet !== ''"
          class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
        >
          Back
        </button>

        <div *ngIf="selectedSet === ''">
          <button
            (click)="setSelectedSet('BT')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            BT
          </button>
          <button
            (click)="setSelectedSet('EX')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            EX
          </button>
          <button
            (click)="setSelectedSet('ST')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            ST
          </button>
          <button
            (click)="setSelectedSet('P')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            P
          </button>
        </div>

        <div *ngIf="selectedSet === 'BT' && collectionList.length === 0">
          <button
            (click)="switch('BT1')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            BT-1
          </button>
          <button
            (click)="switch('BT2')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            BT-2
          </button>
          <button
            (click)="switch('BT3')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            BT-3
          </button>
          <button
            (click)="switch('BT4')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            BT-4
          </button>
          <button
            (click)="switch('BT5')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            BT-5
          </button>
          <button
            (click)="switch('BT6')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            BT-6
          </button>
          <button
            (click)="switch('BT7')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            BT-7
          </button>
          <button
            (click)="switch('BT8')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            BT-8
          </button>
          <button
            (click)="switch('BT9')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            BT-9
          </button>
          <button
            (click)="switch('BT10')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            BT-10
          </button>
        </div>
        <div *ngIf="selectedSet === 'EX' && collectionList.length === 0">
          <button
            (click)="switch('EX1')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            EX-1
          </button>
          <button
            (click)="switch('EX2')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            EX-2
          </button>
          <button
            (click)="switch('EX3')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            EX-3
          </button>
        </div>
        <div *ngIf="selectedSet === 'ST' && collectionList.length === 0">
          <button
            (click)="switch('ST1')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            ST-1
          </button>
          <button
            (click)="switch('ST2')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            ST-2
          </button>
          <button
            (click)="switch('ST3')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            ST-3
          </button>
          <button
            (click)="switch('ST4')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            ST-4
          </button>
          <button
            (click)="switch('ST5')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            ST-5
          </button>
          <button
            (click)="switch('ST6')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            ST-6
          </button>
          <button
            (click)="switch('ST7')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            ST-7
          </button>
          <button
            (click)="switch('ST8')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            ST-8
          </button>
          <button
            (click)="switch('ST9')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            ST-9
          </button>
          <button
            (click)="switch('ST10')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            ST-10
          </button>
          <button
            (click)="switch('ST12')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            ST-12
          </button>
          <button
            (click)="switch('ST13')"
            class="min-w-auto primary-background mt-2 h-8 w-full rounded text-xs font-semibold text-white"
          >
            ST-13
          </button>
        </div>

        <div *ngIf="showCollection">
          <div
            *ngFor="let card of collectionList"
            class="primary-background mt-1 grid w-full grid-cols-12 text-center text-white"
          >
            <div class="col-span-3">{{ card.id }}</div>
            <div class="col-span-7">{{ card.name }}</div>
            <div class="col-span-2">{{ card.count }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
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
