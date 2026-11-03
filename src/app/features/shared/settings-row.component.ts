import { Component, Input } from '@angular/core';

@Component({
  selector: 'digimon-settings-row',
  template: `
    <div class="flex flex-col gap-1 md:grid md:grid-cols-10 md:items-center py-3 border-b border-line last:border-b-0">
      <span class="md:col-span-4 flex flex-col gap-0.5">
        <span class="text-sm font-medium text-fg">{{ title }}</span>
        @if (hint) {
          <span class="text-xs leading-snug text-muted">{{ hint }}</span>
        }
      </span>
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
  @Input() hint = '';
}
