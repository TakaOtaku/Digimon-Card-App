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
          class="Multi w-full"
          [ngStyle]="{ height: 'calc(' + fill[7] + ' * ' + fillPercent + '%)' }"
        ></div>
        <div
          class="White w-full"
          [ngStyle]="{ height: 'calc(' + fill[6] + ' * ' + fillPercent + '%)' }"
        ></div>
        <div
          class="Purple w-full"
          [ngStyle]="{ height: 'calc(' + fill[5] + ' * ' + fillPercent + '%)' }"
        ></div>
        <div
          class="Black w-full"
          [ngStyle]="{ height: 'calc(' + fill[4] + ' * ' + fillPercent + '%)' }"
        ></div>
        <div
          class="Green w-full"
          [ngStyle]="{ height: 'calc(' + fill[3] + ' * ' + fillPercent + '%)' }"
        ></div>
        <div
          class="Yellow w-full"
          [ngStyle]="{ height: 'calc(' + fill[2] + ' * ' + fillPercent + '%)' }"
        ></div>
        <div
          class="Blue w-full"
          [ngStyle]="{ height: 'calc(' + fill[1] + ' * ' + fillPercent + '%)' }"
        ></div>
        <div
          class="Red w-full"
          [ngStyle]="{ height: 'calc(' + fill[0] + ' * ' + fillPercent + '%)' }"
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

  getFillCount(): number {
    let num = 0;
    this.fill.forEach((number) => (num += number));
    return num;
  }
}
