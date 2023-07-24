import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectColorFilter } from '../../../store/digimon.selectors';
import { WebsiteActions } from 'src/app/store/digimon.actions';

@Component({
  selector: 'digimon-color-filter',
  template: `
    <div *ngIf="colorFilter$ | async as colorFilter" class="mb-3">
      <h1 class="mb-2 text-center text-xs font-bold text-[#e2e4e6]">Color:</h1>
      <div class="flex inline-flex w-full justify-center">
        <button
          (click)="changeColor('Red', colorFilter ?? [])"
          [ngClass]="{
            'border-selected': colorFilter.includes('Red'),
            'border-unselected': !colorFilter.includes('Red')
          }"
          class="Red mr-1 h-7 w-7 rounded-full"></button>
        <button
          (click)="changeColor('Blue', colorFilter ?? [])"
          [ngClass]="{
            'border-selected': colorFilter.includes('Blue'),
            'border-unselected': !colorFilter.includes('Blue')
          }"
          class="Blue mr-1 h-7 w-7 rounded-full"></button>
        <button
          (click)="changeColor('Yellow', colorFilter ?? [])"
          [ngClass]="{
            'border-selected': colorFilter.includes('Yellow'),
            'border-unselected': !colorFilter.includes('Yellow')
          }"
          class="Yellow mr-1 h-7 w-7 rounded-full"></button>
        <button
          (click)="changeColor('Green', colorFilter ?? [])"
          [ngClass]="{
            'border-selected': colorFilter.includes('Green'),
            'border-unselected': !colorFilter.includes('Green')
          }"
          class="Green mr-1 h-7 w-7 rounded-full"></button>
        <button
          (click)="changeColor('Black', colorFilter ?? [])"
          [ngClass]="{
            'border-selected': colorFilter.includes('Black'),
            'border-unselected': !colorFilter.includes('Black')
          }"
          class="Black mr-1 h-7 w-7 rounded-full"></button>
        <button
          (click)="changeColor('Purple', colorFilter ?? [])"
          [ngClass]="{
            'border-selected': colorFilter.includes('Purple'),
            'border-unselected': !colorFilter.includes('Purple')
          }"
          class="Purple mr-1 h-7 w-7 rounded-full"></button>
        <button
          (click)="changeColor('White', colorFilter ?? [])"
          [ngClass]="{
            'border-selected': colorFilter.includes('White'),
            'border-unselected': !colorFilter.includes('White')
          }"
          class="White mr-1 h-7 w-7 rounded-full"></button>
        <button
          (click)="changeColor('Multi', colorFilter ?? [])"
          [ngClass]="{
            'border-selected': colorFilter.includes('Multi'),
            'border-unselected': !colorFilter.includes('Multi')
          }"
          class="Multi h-7 w-7 rounded-full"></button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgIf, NgClass, AsyncPipe],
})
export class ColorFilterComponent {
  colorFilter$ = this.store.select(selectColorFilter);

  constructor(private store: Store) {}

  changeColor(color: string, colorFilter: string[]) {
    let colors = [];
    if (colorFilter && colorFilter.includes(color)) {
      colors = colorFilter.filter((value) => value !== color);
    } else {
      colors = [...new Set(colorFilter), color];
    }

    this.store.dispatch(WebsiteActions.setcolorfilter({ colorFilter: colors }));
  }
}
