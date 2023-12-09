import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'digimon-settings-row',
  template: `
    <div class="grid grid-cols-10 items-center my-1">
      <h5 class="col-span-4 mr-5 font-bold">{{ title }}</h5>
      <div class="col-span-6 justify-center">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgClass],
})
export class SettingsRowComponent {
  @Input() title: string = '';
}
