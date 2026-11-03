import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { DigimonCard } from '@models';
import { DigimonCardStore } from '@store';
import { SaveStore } from '@store';

@Component({
  selector: 'digimon-collection-circle',
  template: ` <p-chart type="doughnut" height="100" width="100" [data]="data" [options]="chartOptions"></p-chart> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ChartModule],
})
export class CollectionCircleComponent {
  @Input() type: 'BT' | 'EX' | 'ST' | 'P-';
  changeDetection = inject(ChangeDetectorRef);

  saveStore = inject(SaveStore);
  digimonCardStore = inject(DigimonCardStore);

  data: any;
  chartOptions = {
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

  updateCircle = effect(() => {
    const settings = this.saveStore.settings();
    const collection = this.saveStore.collection();

    let setCards = this.digimonCardStore.cards().filter((card: DigimonCard) => card.id.includes('-') && card.id.includes(this.type));

    // Remove AA cards from being counted for the circle
    if (settings.aaCollectionMinimum === 0) {
      setCards = setCards.filter((card: DigimonCard) => card.version === 'Normal');
    }

    // Filter our cards that are collected from the settings
    if (settings.collectionSets.length > 0) {
      setCards = setCards.filter((card: DigimonCard) => {
        const cardSet = card.id.split('-')[0];
        return settings.collectionSets.includes(cardSet);
      });
    }

    // One lookup per card instead of scanning the whole collection for each of ~4.5k cards (froze the profile page)
    const counts = new Map<string, number>();
    for (const colCard of collection) {
      if (!counts.has(colCard.id)) counts.set(colCard.id, colCard.count);
    }

    const setCardsCollected = setCards.filter((card: DigimonCard) => {
      const count = counts.get(card.id);
      if (count === undefined) {
        return false;
      }
      return count >= (card.version !== 'Normal' ? settings.aaCollectionMinimum : settings.collectionMinimum);
    });

    const collectionColors = this.getColorCardArray(setCardsCollected);

    this.data = {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Purple', 'White', 'Missing'],
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
          backgroundColor: ['#ef1919', '#19a0e3', '#ffd619', '#19b383', '#191919', '#8d6fdb', '#ffffff', '#26354f'],
          hoverBackgroundColor: ['#ef1919', '#19a0e3', '#ffd619', '#19b383', '#191919', '#8d6fdb', '#ffffff', '#26354f'],
        },
      ],
    };
    this.changeDetection.detectChanges();
  });

  getColorCardArray(cards: DigimonCard[]): number[] {
    const red = cards.filter((card) => card.color.startsWith('Red')).length;
    const blue = cards.filter((card) => card.color.startsWith('Blue')).length;
    const yellow = cards.filter((card) => card.color.startsWith('Yellow')).length;
    const green = cards.filter((card) => card.color.startsWith('Green')).length;
    const black = cards.filter((card) => card.color.startsWith('Black')).length;
    const purple = cards.filter((card) => card.color.startsWith('Purple')).length;
    const white = cards.filter((card) => card.color.startsWith('White')).length;

    return [red, blue, yellow, green, black, purple, white];
  }
}
