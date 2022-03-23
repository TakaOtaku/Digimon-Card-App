import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'digimon-multi-select',
  templateUrl: './multi-select.component.html'
})
export class MultiSelectComponent {
  @Input() formControl: FormControl;
  @Input() options: any[];
  @Input() group: boolean = false;
  @Input() label: string;
}
