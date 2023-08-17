import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DigimonCard, ICountCard } from '../../../../models';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'digimon-collection-stats-dialog',
  template: `<!--div [formGroup]="languageForm">
  <p-checkbox class="ml-2" formControlName="english" label="English" name="language"></p-checkbox>
  <p-checkbox class="ml-2" formControlName="japanese" label="Japanese" name="language"></p-checkbox>
</div>

<div [formGroup]="versionForm">
  <p-checkbox class="ml-2" formControlName="normal" label="Normal" name="version" value="Normal"></p-checkbox>
  <p-checkbox class="ml-2" formControlName="aa" label="AA" name="version" value="AA"></p-checkbox>
  <p-checkbox class="ml-2" formControlName="stamped" label="Stamped" name="version" value="Stamped"></p-checkbox>
</div>

<div class="flex flex-row">
  <div class="field-radiobutton ml-2">
    <p-radioButton inputId="type1" name="type1" value="Normal"></p-radioButton>
    <label for="type1">Normal</label>
  </div>
  <div class="field-radiobutton ml-2">
    <p-radioButton inputId="type2" name="type2" value="Playset"></p-radioButton>
    <label for="type2">Playset</label>
  </div>
  <div class="field-radiobutton ml-2">
    <p-radioButton inputId="type3" name="type3" value="Playset+"></p-radioButton>
    <label for="type3">Playset+</label>
  </div>
</div-->

    <p-chart
      [data]="collectionData"
      [options]="chartOptions"
      type="bar"></p-chart> `,
  standalone: true,
  imports: [ChartModule],
})
export class CollectionStatsDialogComponent implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() digimonCards: DigimonCard[];
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
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  versionForm = new UntypedFormGroup({
    normal: new UntypedFormControl(true),
    aa: new UntypedFormControl(false),
    stamped: new UntypedFormControl(false),
  });

  languageForm = new UntypedFormGroup({
    english: new UntypedFormControl(true),
    japanese: new UntypedFormControl(false),
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
          backgroundColor: '#000000',
          data: [btData[1], exData[1], stData[1]],
        },
      ],
    };
  }

  private getBoosterCards(type: string): number[] {
    //const allCards = this.filterLanguageAllCards();
    const set = this.digimonCards.filter((card) =>
      card.cardNumber.includes(type)
    );

    //const collection = this.filterLanguageCollection();
    const have = this.collection.filter((card) => card.id.includes(type));

    return [have.length, set.length - have.length];
  }

  /*  private filterLanguageAllCards(): DigimonCard[] {
      let array = [];
      if(this.languageForm.get('english')?.value) {
        array = [...new Set(this.digimonCards.filter((card) => card.))];
      }
      if(this.languageForm.get('english')?.value) {

      }
      return array;
    }

    private filterLanguageCollection(): ICountCard[] {
      return;
    }*/
}
