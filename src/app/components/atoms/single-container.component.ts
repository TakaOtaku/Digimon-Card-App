import { Component, Input } from '@angular/core';

@Component({
  selector: 'digimon-single-container',
  template: `
    <div class="m-1 h-full">
      <p class="primary-color text-center font-bold">
        {{ value }}
      </p>
      <div class="stat-container">
        <div
          class="w-full"
          [ngStyle]="{
            height: 'calc(' + value + ' * ' + percent + '%)',
            backgroundColor: color
          }"
        ></div>
      </div>
      <p class="primary-color text-center text-xs font-bold">{{ label }}</p>
    </div>
  `,
})
export class SingleContainerComponent {
  @Input() public label: string;
  @Input() public value: number;
  @Input() public percent?: string = '2';
  @Input() public color?: string = '#08528d';
}
