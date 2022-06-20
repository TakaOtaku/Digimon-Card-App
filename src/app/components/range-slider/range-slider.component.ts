import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { ICard } from '../../../models';

@Component({
  selector: 'digimon-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
})
export class RangeSliderComponent implements OnInit, OnDestroy {
  @Input() slider: number[] = [];
  @Input() minMax: number[] = [];
  @Input() title: string = '';
  @Input() suffix?: string = '';
  @Output() OnSliderChange = new EventEmitter<any>();

  sliderControl = new FormControl([20, 80]);

  options = {};

  private onDestroy$ = new Subject();

  ngOnInit(): void {
    this.sliderControl.setValue(this.slider);
    this.options = {
      floor: this.minMax[0],
      ceil: this.minMax[1],
      translate: (value: number): string => {
        return this.suffix ? value + this.suffix : value + '';
      },
    };
    this.sliderControl.valueChanges.subscribe((values) =>
      this.OnSliderChange.emit({ values })
    );
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
