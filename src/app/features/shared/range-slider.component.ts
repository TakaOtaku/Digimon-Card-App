import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'digimon-range-slider',
  template: `
    <div class="custom-slider mx-5 flex flex-row">
      <ngx-slider
        [formControl]="sliderControl"
        class="w-full"
        [options]="options"
      ></ngx-slider>
    </div>

    <h1 class="mb-1 mt-[-8px] text-center text-xs font-bold text-[#e2e4e6]">
      {{ title }}
    </h1>
  `,
  styleUrls: ['../collection/range-slider.component.scss'],
})
export class RangeSliderComponent implements OnInit, OnDestroy {
  @Input() minMax: number[] = [];
  @Input() title: string = '';
  @Input() suffix?: string = '';
  @Input() reset: EventEmitter<void>;
  @Output() change = new EventEmitter<number[]>();

  sliderControl = new FormControl([20, 80]);

  options = {};

  private onDestroy$ = new Subject();

  ngOnInit(): void {
    this.sliderControl.setValue(this.minMax, { emitEvent: false });
    this.sliderControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((values) => this.change.emit(values));

    this.options = {
      floor: this.minMax[0],
      ceil: this.minMax[1],
      translate: (value: number): string => {
        return this.suffix ? value + this.suffix : value + '';
      },
    };

    this.reset.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.sliderControl.setValue(this.minMax, { emitEvent: false });
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
