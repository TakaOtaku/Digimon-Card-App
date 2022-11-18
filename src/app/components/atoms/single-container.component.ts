import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'digimon-single-container',
  template: `
    <div class="m-0.5 h-full">
      <p class="text-center text-white">
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
      <p class="text-center text-xs text-white">{{ label }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleContainerComponent {
  @Input() public label: string;
  @Input() public value: number;
  @Input() public percent?: string = '2';
  @Input() public color?: string = '#08528d';
}
