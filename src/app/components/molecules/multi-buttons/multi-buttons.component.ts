import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface MultiButtons {
  name: string;
  value: any;
}

@Component({
  selector: 'digimon-multi-buttons',
  templateUrl: './multi-buttons.component.html',
  styleUrls: ['./multi-buttons.component.css'],
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
