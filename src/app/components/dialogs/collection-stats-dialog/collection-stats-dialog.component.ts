import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ICard, ICountCard } from '../../../../models';

@Component({
  selector: 'digimon-collection-stats-dialog',
  templateUrl: './collection-stats-dialog.component.html',
})
export class CollectionStatsDialogComponent implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() digimonCards: ICard[];
  @Input() collection: ICountCard[];

  @Output() onClose = new EventEmitter<boolean>();

  collectionData: any;
  chartOptions = {
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    responsive: true,
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  };

  versionForm = new FormGroup({
    normal: new FormControl(true),
    aa: new FormControl(false),
    stamped: new FormControl(false),
  });

  constructor() {}

  ngOnInit(): void {
    this.getCollectionStats();
  }

  ngOnChanges(): void {
    this.getCollectionStats();
  }

  getCollectionStats() {
    const btData = this.getBoosterCards('BT');
    const exData = this.getBoosterCards('EX');
    const stData = this.getBoosterCards('ST');

    this.collectionData = {
      labels: ['BT', 'EX', 'ST'],
      datasets: [
        {
          type: 'bar',
          label: 'Collected',
          backgroundColor: '#FFFFFF',
          data: [btData[0], exData[0], stData[0]],
        },
        {
          type: 'bar',
          label: 'Not Collected',
          backgroundColor: '#808080',
          data: [btData[1], exData[1], stData[1]],
        },
      ],
    };
  }

  private getBoosterCards(type: string): number[] {
    const set = this.digimonCards.filter((card) =>
      card.cardNumber.includes(type)
    );
    const have = this.collection.filter((card) => card.id.includes(type));

    return [have.length, set.length - have.length];
  }
}
