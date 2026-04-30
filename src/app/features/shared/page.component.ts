import { NgClass } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BlockableUI } from 'primeng/api';

@Component({
  selector: 'digimon-page',
  template: `
    <div
      #content
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
export class PageComponent implements BlockableUI {
  @Input() flex = 'row';
  @ViewChild('content') content!: ElementRef;

  getBlockableElement(): HTMLElement {
    return this.content?.nativeElement;
  }
}
