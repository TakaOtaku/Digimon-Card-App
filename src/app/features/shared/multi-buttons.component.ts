import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

export interface MultiButtons {
  name: string;
  value: any;
}

@Component({
  selector: 'digimon-multi-buttons',
  template: `
    <div class="mx-auto mb-2 max-w-[250px]">
      <h1 class="mb-1 text-center text-xs font-bold text-fg">{{ title }}:</h1>
      <div [ngClass]="grid" class="my-2 grid w-full justify-center gap-1">
        <button
          type="button"
          (click)="clickEvent.emit(button.value)"
          *ngFor="let button of buttonArray"
          [attr.aria-pressed]="value.includes(button.value)"
          [ngClass]="value.includes(button.value) ? 'border-accent bg-ink-2 text-accent' : 'border-line bg-ink-2 text-fg hover:border-muted'"
          class="min-w-auto h-8 rounded-full border px-2 text-xs font-semibold">
          {{ button.name }}
        </button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgClass, NgFor],
})
export class MultiButtonsComponent implements OnInit {
  @Input() title = '';
  @Input() buttonArray!: MultiButtons[];
  @Input() value: any;
  @Input() perRow: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 = 3;
  @Output() clickEvent = new EventEmitter<any>();

  grid = 'grid-cols-3';

  ngOnInit() {
    const gridMap = new Map<number, string>([
      [2, 'grid-cols-2'],
      [3, 'grid-cols-3'],
      [4, 'grid-cols-4'],
      [5, 'grid-cols-5'],
      [6, 'grid-cols-6'],
      [7, 'grid-cols-7'],
      [8, 'grid-cols-8'],
      [9, 'grid-cols-9'],
      [10, 'grid-cols-10'],
    ]);

    this.grid = gridMap.get(this.perRow)!;
  }
}
