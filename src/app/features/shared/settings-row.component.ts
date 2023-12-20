import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'digimon-settings-row',
  template: `
    <div class="flex flex-col md:grid md:grid-cols-10 items-center my-1">
      <h5 class="md:col-span-4 mr-5 font-bold">{{ title }}</h5>
      <div class="md:col-span-6 justify-center">
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
