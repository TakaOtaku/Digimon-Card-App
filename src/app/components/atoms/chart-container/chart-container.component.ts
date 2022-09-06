import { Component, Input } from '@angular/core';

@Component({
  selector: 'digimon-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss'],
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
