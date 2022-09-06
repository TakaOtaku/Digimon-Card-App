import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from "@angular/forms";

export interface MultiButtons {
  name: string;
  value: any;
}

@Component({
  selector: 'digimon-multi-buttons',
  templateUrl: './multi-buttons.component.html',
  styleUrls: ['./multi-buttons.component.css']
})
export class MultiButtonsComponent {
  @Input() title = '';
  @Input() buttonArray: MultiButtons[];
  @Input() filterFormControl: FormControl;
  @Output() clickEvent = new EventEmitter<any>();
}
