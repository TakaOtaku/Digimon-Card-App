import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'digimon-range-slider',
  template: `
    <div class="flex flex-row">
      <span class="ml-2">{{ filterFormControl?.value[0] ?? minMax[0] }}</span>
      <span class="ml-auto mr-2">{{ filterFormControl?.value[1] ?? minMax[1] }}</span>
    </div>
    <div class="custom-slider flex flex-row px-3 my-3">
      <p-slider
        [formControl]="filterFormControl"
        [min]="minMax[0]"
        [max]="minMax[1]"
        step="1"
        class="w-full"
        orientation="horizontal"
        range="true"></p-slider>
    </div>

    <h1 class="mt-[-5px] text-center text-xs font-bold text-[#e2e4e6]">
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

  private onDestroy$ = new Subject<void>();

  ngOnInit(): void {
    this.reset.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.filterFormControl.setValue(this.minMax, { emitEvent: false });
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
