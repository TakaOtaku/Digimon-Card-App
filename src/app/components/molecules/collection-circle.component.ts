import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, first, Subject } from 'rxjs';
import { ICard, ICountCard } from '../../../models';
import {
  selectAllCards,
  selectCollectionMinimum,
} from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-collection-circle',
  template: `
    <p-chart type="doughnut" [data]="data" [options]="chartOptions"></p-chart>
  `,
})
export class CollectionCircleComponent implements OnInit, OnChanges, OnDestroy {
  @Input() type: 'BT' | 'EX' | 'ST' | 'P';
  @Input() collection: ICountCard[];

  data: any;

  chartOptions: any;

  private onDestroy$ = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.chartOptions = {
      plugins: {
        legend: {
          display: false,
          labels: {
            color: '#ebedef',
          },
        },
      },
    };

    this.updateCircle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['collection']) {
      this.updateCircle();
    }
  }

  updateCircle() {
    const cards$ = this.store.select(selectAllCards);
    const settings$ = this.store.select(selectCollectionMinimum);

    combineLatest([cards$, settings$])
      .pipe(first())
      .subscribe((values) => {
        const collectionMinimum: number = values[1];
        const normalCards = values[0].filter(
          (card) => card.version === 'Normal'
        );
        const collection = this.collection.filter(
          (card) => !card.id.includes('_P')
        );

        const setCards = normalCards.filter((card) =>
          card.id.includes(this.type)
        );

        const setCardsCollected = setCards.filter((card) =>
          collection.find(
            (colCard) =>
              colCard.id === card.id && colCard.count >= collectionMinimum
          )
        );

        //const SetCardsColors = this.getColorCardArray(setCards);

        const collectionColors = this.getColorCardArray(setCardsCollected);

        this.data = {
          labels: [
            'Red',
            'Blue',
            'Yellow',
            'Green',
            'Black',
            'Purple',
            'White',
            'Missing',
          ],
          datasets: [
            {
              data: [
                collectionColors[0],
                collectionColors[1],
                collectionColors[2],
                collectionColors[3],
                collectionColors[4],
                collectionColors[5],
                collectionColors[6],
                setCards.length - setCardsCollected.length,
              ],
              backgroundColor: [
                '#ef1919',
                '#19a0e3',
                '#ffd619',
                '#19b383',
                '#191919',
                '#8d6fdb',
                '#ffffff',
                'grey',
              ],
              hoverBackgroundColor: [
                '#ef1919',
                '#19a0e3',
                '#ffd619',
                '#19b383',
                '#191919',
                '#8d6fdb',
                '#ffffff',
                'grey',
              ],
            },
          ],
        };
      });
  }

  getColorCardArray(cards: ICard[]): number[] {
    const red = cards.filter((card) => card.color.startsWith('Red')).length;
    const blue = cards.filter((card) => card.color.startsWith('Blue')).length;
    const yellow = cards.filter((card) =>
      card.color.startsWith('Yellow')
    ).length;
    const green = cards.filter((card) => card.color.startsWith('Green')).length;
    const black = cards.filter((card) => card.color.startsWith('Black')).length;
    const purple = cards.filter((card) =>
      card.color.startsWith('Purple')
    ).length;
    const white = cards.filter((card) => card.color.startsWith('White')).length;

    return [red, blue, yellow, green, black, purple, white];
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
