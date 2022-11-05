import { Component, Input } from '@angular/core';

@Component({
  selector: 'digimon-single-container',
  templateUrl: './single-container.component.html',
})
export class SingleContainerComponent {
  @Input() public label: string;
  @Input() public value: number;
  @Input() public percent?: string = '2';
  @Input() public color?: string = '#08528d';
}
