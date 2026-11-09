import { NgClass } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FilterStore } from '../../../store/filter.store';

@Component({
  selector: 'digimon-color-filter',
  template: `
    <div class="mb-3">
      <h2 class="mb-2 text-center text-xs font-bold text-fg">Color:</h2>
      <div class="inline-flex w-full justify-center">
        <button
          (click)="changeColor('Red', colorFilter)"
          [ngClass]="{
            'border-selected': colorFilter.includes('Red'),
            'border-unselected': !colorFilter.includes('Red'),
          }"
          class="Red mr-1 h-8 w-8 rounded-full" type="button" aria-label="Red" [attr.aria-pressed]="colorFilter.includes('Red')"></button>
        <button
          (click)="changeColor('Blue', colorFilter)"
          [ngClass]="{
            'border-selected': colorFilter.includes('Blue'),
            'border-unselected': !colorFilter.includes('Blue'),
          }"
          class="Blue mr-1 h-8 w-8 rounded-full" type="button" aria-label="Blue" [attr.aria-pressed]="colorFilter.includes('Blue')"></button>
        <button
          (click)="changeColor('Yellow', colorFilter)"
          [ngClass]="{
            'border-selected': colorFilter.includes('Yellow'),
            'border-unselected': !colorFilter.includes('Yellow'),
          }"
          class="Yellow mr-1 h-8 w-8 rounded-full" type="button" aria-label="Yellow" [attr.aria-pressed]="colorFilter.includes('Yellow')"></button>
        <button
          (click)="changeColor('Green', colorFilter)"
          [ngClass]="{
            'border-selected': colorFilter.includes('Green'),
            'border-unselected': !colorFilter.includes('Green'),
          }"
          class="Green mr-1 h-8 w-8 rounded-full" type="button" aria-label="Green" [attr.aria-pressed]="colorFilter.includes('Green')"></button>
        <button
          (click)="changeColor('Black', colorFilter)"
          [ngClass]="{
            'border-selected': colorFilter.includes('Black'),
            'border-unselected': !colorFilter.includes('Black'),
          }"
          class="Black mr-1 h-8 w-8 rounded-full" type="button" aria-label="Black" [attr.aria-pressed]="colorFilter.includes('Black')"></button>
        <button
          (click)="changeColor('Purple', colorFilter)"
          [ngClass]="{
            'border-selected': colorFilter.includes('Purple'),
            'border-unselected': !colorFilter.includes('Purple'),
          }"
          class="Purple mr-1 h-8 w-8 rounded-full" type="button" aria-label="Purple" [attr.aria-pressed]="colorFilter.includes('Purple')"></button>
        <button
          (click)="changeColor('White', colorFilter)"
          [ngClass]="{
            'border-selected': colorFilter.includes('White'),
            'border-unselected': !colorFilter.includes('White'),
          }"
          class="White mr-1 h-8 w-8 rounded-full" type="button" aria-label="White" [attr.aria-pressed]="colorFilter.includes('White')"></button>
        <button
          (click)="changeColor('Multi', colorFilter)"
          [ngClass]="{
            'border-selected': colorFilter.includes('Multi'),
            'border-unselected': !colorFilter.includes('Multi'),
          }"
          class="Multi h-8 w-8 rounded-full" type="button" aria-label="Multi" [attr.aria-pressed]="colorFilter.includes('Multi')"></button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgClass],
})
export class ColorFilterComponent {
  filterStore = inject(FilterStore);
  colorFilter: string[] = this.filterStore.colorFilter();

  filterChange = effect(() => {
    this.colorFilter = this.filterStore.colorFilter();
  });

  changeColor(color: string, colorFilter: string[]) {
    let colors = [];
    if (colorFilter && colorFilter.includes(color)) {
      colors = colorFilter.filter((value) => value !== color);
    } else {
      colors = [...new Set(colorFilter), color];
    }

    this.filterStore.updateColorFilter(colors);
  }
}
