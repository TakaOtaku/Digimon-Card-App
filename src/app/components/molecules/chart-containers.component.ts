import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IDeckCard } from '../../../models';

@Component({
  selector: 'digimon-chart-containers',
  template: `
    <div class="jusify-between flex flex-row">
      <digimon-chart-container
        label="Lv.2"
        [fill]="digiEggs"
        fillPercent="20"
      ></digimon-chart-container>
      <digimon-chart-container
        label="Lv.3"
        [fill]="lv3"
      ></digimon-chart-container>
      <digimon-chart-container
        label="Lv.4"
        [fill]="lv4"
      ></digimon-chart-container>
      <digimon-chart-container
        label="Lv.5"
        [fill]="lv5"
      ></digimon-chart-container>
      <digimon-chart-container
        label="Lv.6"
        [fill]="lv6"
      ></digimon-chart-container>
      <digimon-chart-container
        label="Lv.7+"
        [fill]="lv7"
      ></digimon-chart-container>
      <digimon-chart-container
        label="TM"
        [fill]="tamer"
      ></digimon-chart-container>
      <digimon-chart-container
        label="OP"
        [fill]="options"
      ></digimon-chart-container>
    </div>
  `,
})
export class ChartContainersComponent implements OnInit, OnChanges {
  @Input() public deck: IDeckCard[];

  digiEggs: number[];
  lv3: number[];
  lv4: number[];
  lv5: number[];
  lv6: number[];
  lv7: number[];
  tamer: number[];
  options: number[];

  constructor() {}

  ngOnInit(): void {
    this.setupChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setupChart();
  }

  private setupChart() {
    const eggs = this.deck.filter((card) => card.cardType === 'Digi-Egg');
    this.digiEggs = this.filterColor(eggs);

    const lv3 = this.deck.filter((card) => card.cardLv === 'Lv.3');
    this.lv3 = this.filterColor(lv3);
    const lv4 = this.deck.filter((card) => card.cardLv === 'Lv.4');
    this.lv4 = this.filterColor(lv4);
    const lv5 = this.deck.filter((card) => card.cardLv === 'Lv.5');
    this.lv5 = this.filterColor(lv5);
    const lv6 = this.deck.filter((card) => card.cardLv === 'Lv.6');
    this.lv6 = this.filterColor(lv6);
    const lv7 = this.deck.filter((card) => card.cardLv === 'Lv.7');
    this.lv7 = this.filterColor(lv7);

    const tamer = this.deck.filter((card) => card.cardType === 'Tamer');
    this.tamer = this.filterColor(tamer);

    const options = this.deck.filter((card) => card.cardType === 'Option');
    this.options = this.filterColor(options);
  }

  private filterColor(array: IDeckCard[]): number[] {
    const red = array.filter((card) => card.color === 'Red');
    const blue = array.filter((card) => card.color === 'Blue');
    const yellow = array.filter((card) => card.color === 'Yellow');
    const green = array.filter((card) => card.color === 'Green');
    const black = array.filter((card) => card.color === 'Black');
    const purple = array.filter((card) => card.color === 'Purple');
    const white = array.filter((card) => card.color === 'White');
    const multi = array.filter(
      (card) => card.color.includes('/') || card.color === 'Multi'
    );

    return [
      this.getCount(red),
      this.getCount(blue),
      this.getCount(yellow),
      this.getCount(green),
      this.getCount(black),
      this.getCount(purple),
      this.getCount(white),
      this.getCount(multi),
    ];
  }

  private getCount(array: IDeckCard[]): number {
    let number = 0;
    array.forEach((card) => (number += card.count));
    return number;
  }
}
