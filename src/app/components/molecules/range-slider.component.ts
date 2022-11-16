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

    <h1 class="mb-1 mt-[-8px] text-center text-xs font-bold text-white">
      {{ title }}
    </h1>
  `,
  styles: [
    `
      ::ng-deep {
        .custom-slider .ngx-slider .ngx-slider-bar {
          background: #08528d;
          height: 2px;
        }
        .custom-slider .ngx-slider .ngx-slider-selection {
          background: var(--primary-color);
        }

        .custom-slider .ngx-slider .ngx-slider-pointer {
          width: 8px;
          height: 16px;
          top: auto; /* to remove the default positioning */
          bottom: -5px;
          background-color: var(--primary-color);
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
        }

        .custom-slider .ngx-slider .ngx-slider-pointer:after {
          display: none;
        }

        .custom-slider .ngx-slider .ngx-slider-bubble {
          color: white;
          bottom: 8px;
        }

        .custom-slider .ngx-slider .ngx-slider-limit {
          font-weight: bold;
          color: var(--primary-color);
        }

        .custom-slider .ngx-slider .ngx-slider-tick {
          width: 1px;
          height: 10px;
          margin-left: 4px;
          border-radius: 0;
          background: #08528d;
          top: -1px;
        }

        .custom-slider .ngx-slider .ngx-slider-tick.ngx-slider-selected {
          background: var(--primary-color);
        }
      }
    `,
  ],
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
