import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartModule } from 'primeng/chart';
import { combineLatestWith, first, Subject } from 'rxjs';
import { DigimonCard, ICountCard } from '../../../../models';
import {
  selectAllCards,
  selectSettings,
} from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-collection-circle',
  template: `
    <p-chart
      type="doughnut"
      height="100"
      width="100"
      [data]="data"
      [options]="chartOptions"></p-chart>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ChartModule],
})
export class CollectionCircleComponent implements OnInit, OnChanges, OnDestroy {
  @Input() type: 'BT' | 'EX' | 'ST' | 'P-';
  @Input() collection: ICountCard[];

  data: any;

  chartOptions: any;

  private onDestroy$ = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.chartOptions = {
      maintainAspectRatio: false,
      responsive: false,
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
    this.store
      .select(selectAllCards)
      .pipe(combineLatestWith(this.store.select(selectSettings)), first())
      .subscribe(([allCards, settings]) => {
        const normalCards = allCards;
        const collection = this.collection;

        let setCards = normalCards.filter(
          (card: DigimonCard) =>
            card.id.includes('-') && card.id.includes(this.type),
        );

        // Remove AA cards from being counted for the circle
        if (settings.aaCollectionMinimum === 0) {
          setCards = setCards.filter(
            (card: DigimonCard) => card.version === 'Normal',
          );
        }

        // Filter our cards that are collected from the settings
        if (settings.collectionSets.length > 0) {
          setCards = setCards.filter((card: DigimonCard) => {
            const cardSet = card.id.split('-')[0];
            return settings.collectionSets.includes(cardSet);
          });
        }

        const setCardsCollected = setCards.filter((card: DigimonCard) =>
          collection.find((colCard) => {
            if (colCard.id !== card.id) {
              return;
            }

            if (card.version !== 'Normal') {
              return colCard.count >= settings.aaCollectionMinimum;
            }

            return colCard.count >= settings.collectionMinimum;
          }),
        );

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

  getColorCardArray(cards: DigimonCard[]): number[] {
    const red = cards.filter((card) => card.color.startsWith('Red')).length;
    const blue = cards.filter((card) => card.color.startsWith('Blue')).length;
    const yellow = cards.filter((card) =>
      card.color.startsWith('Yellow'),
    ).length;
    const green = cards.filter((card) => card.color.startsWith('Green')).length;
    const black = cards.filter((card) => card.color.startsWith('Black')).length;
    const purple = cards.filter((card) =>
      card.color.startsWith('Purple'),
    ).length;
    const white = cards.filter((card) => card.color.startsWith('White')).length;

    return [red, blue, yellow, green, black, purple, white];
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
