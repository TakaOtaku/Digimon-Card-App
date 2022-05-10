import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'digimon-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.css']
})
export class RangeSliderComponent {
  @Input() slider: number[] = [];
  @Input() minMax: number[] = [];
  @Input() title: string = '';
  @Output() OnSliderChange = new EventEmitter<any>();

  changeMin(event: any) {
    this.slider[0] = event.value;
    this.OnSliderChange.emit({values: this.slider});
  }

  changeMax(event: any) {
    this.slider[1] = event.value;
    this.OnSliderChange.emit({values: this.slider});
  }
}
