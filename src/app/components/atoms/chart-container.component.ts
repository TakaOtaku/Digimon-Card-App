import { Component, Input } from '@angular/core';

@Component({
  selector: 'digimon-chart-container',
  template: `
    <div class="m-1 h-full w-8">
      <p class="primary-color text-center font-bold">
        {{ getFillCount() }}
      </p>
      <div class="stat-container">
        <div
          *ngFor="let color of colors; let i = index"
          [ngClass]="color"
          class="w-full"
          [ngStyle]="{
            height: 'calc(' + fill[7 - i] + ' * ' + fillPercent + '%)'
          }"
        ></div>
      </div>
      <p class="primary-color text-center font-bold">{{ label }}</p>
    </div>
  `,
})
export class ChartContainerComponent {
  @Input() public label: string;
  @Input() public fill: number[];
  @Input() public fillPercent?: string = '3.333';

  colors = [
    'Multi',
    'White',
    'Purple',
    'Black',
    'Green',
    'Yellow',
    'Blue',
    'Red',
  ];

  getFillCount(): number {
    let num = 0;
    this.fill.forEach((number) => (num += number));
    return num;
  }
}
