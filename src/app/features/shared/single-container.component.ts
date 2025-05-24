import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'digimon-single-container',
  template: `
    <div class="m-0.5 h-full">
      <p class="text-center text-[#e2e4e6]">
        {{ value }}
      </p>
      <div class="stat-container">
        <div
          class="w-full"
          [ngStyle]="{
            height: 'calc(' + value + ' * ' + percent + '%)',
            backgroundColor: color,
          }"></div>
      </div>
      <p class="text-center text-xs text-[#e2e4e6]">{{ label }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgStyle],
})
export class SingleContainerComponent {
  @Input() public label!: string;
  @Input() public value!: number;
  @Input() public percent?: string = '2';
  @Input() public color?: string = '#08528d';
}
