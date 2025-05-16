import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'digimon-range-slider',
  template: `
    <div class="custom-slider flex flex-row px-3">
      <p-slider [formControl]="filterFormControl" class="w-full" orientation="horizontal" range="true"></p-slider>
    </div>

    <h1 class="mb-1 mt-[-8px] text-center text-xs font-bold text-[#e2e4e6]">
      {{ title }}
    </h1>
  `,
  styleUrls: ['./range-slider.component.scss'],
  standalone: true,
  imports: [SliderModule, FormsModule, ReactiveFormsModule],
})
export class RangeSliderComponent implements OnInit, OnDestroy {
  @Input() minMax: number[] = [];
  @Input() title: string = '';
  @Input() suffix?: string = '';
  @Input() reset!: EventEmitter<void>;
  @Input() filterFormControl!: UntypedFormControl;

  options = {};

  private onDestroy$ = new Subject();

  ngOnInit(): void {
    this.filterFormControl.setValue(this.minMax, { emitEvent: false });

    this.options = {
      floor: this.minMax[0],
      ceil: this.minMax[1],
      translate: (value: number): string => {
        return this.suffix ? value + this.suffix : value + '';
      },
    };

    this.reset.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.filterFormControl.setValue(this.minMax, { emitEvent: false });
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
