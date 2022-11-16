import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface MultiButtons {
  name: string;
  value: any;
}

@Component({
  selector: 'digimon-multi-buttons',
  template: `
    <div class="mx-auto mb-2 max-w-[250px]">
      <h1 class="mb-1 text-center text-xs font-bold text-white">
        {{ title }}:
      </h1>
      <div [ngClass]="grid" class="my-2 grid w-full justify-center">
        <button
          (click)="clickEvent.emit(button.value)"
          *ngFor="let button of buttonArray"
          [ngClass]="{
            'primary-background': filterFormControl.value.includes(button.value)
          }"
          class="min-w-auto h-8 rounded-l-sm border border-slate-100 p-0.5 py-2 text-xs font-semibold text-white"
        >
          {{ button.name }}
        </button>
      </div>
    </div>
  `,
})
export class MultiButtonsComponent implements OnInit {
  @Input() title = '';
  @Input() buttonArray: MultiButtons[];
  @Input() filterFormControl: FormControl;
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
