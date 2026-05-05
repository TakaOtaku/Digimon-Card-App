import { Component, Input } from '@angular/core';

@Component({
  selector: 'digimon-settings-row',
  template: `
    <div class="flex flex-col gap-1 md:grid md:grid-cols-10 md:items-center py-3 border-b border-white/10 last:border-b-0">
      <span class="md:col-span-4 text-sm font-medium text-[#e2e4e6]/80">{{ title }}</span>
      <div class="md:col-span-6 flex items-center">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  standalone: true,
  imports: [],
})
export class SettingsRowComponent {
  @Input() title: string = '';
}
