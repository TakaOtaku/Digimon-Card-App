import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'digimon-page',
  template: `
    <div
      ngClass="{{ flex === 'row' ? 'flex-row' : 'flex-col' }}"
      class="overflow-y-auto overflow-x-hidden
      flex items-center justify-center relative
      h-[calc(100vh-3.5rem)] md:h-[calc(100vh-5rem)] lg:h-screen
      w-screen lg:w-[calc(100vw-6.5rem)]">
      <ng-content></ng-content>
    </div>
  `,
  standalone: true,
  imports: [NgClass],
})
export class PageComponent {
  @Input() flex = 'row';
}
