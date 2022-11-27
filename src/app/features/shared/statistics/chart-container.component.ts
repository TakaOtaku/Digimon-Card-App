import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'digimon-chart-container',
  template: `
    <div class="m-0.5 h-full w-8">
      <p class="text-center text-[#e2e4e6]">
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
      <p class="text-center text-xs text-[#e2e4e6]">{{ label }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
