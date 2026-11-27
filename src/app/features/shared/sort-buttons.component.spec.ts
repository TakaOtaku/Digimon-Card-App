import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SaveStore } from '../../store/save.store';
import { SortButtonsComponent } from './sort-buttons.component';

describe('SortButtonsComponent', () => {
  const showPrices = signal(false);
  let component: SortButtonsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: SaveStore, useValue: { showPrices } }] });
    component = TestBed.runInInjectionContext(() => new SortButtonsComponent());
  });

  const labels = () => component.sortOptions().map((option) => option.label);

  // A new array per change detection makes PrimeNG rebuild the menu between mousedown and mouseup
  it('keeps the same menu model until the price setting changes', () => {
    showPrices.set(false);
    const model = component.sortOptions();
    expect(component.sortOptions()).toBe(model);
    expect(labels()).toEqual(['ID', 'Cost', 'DP', 'Level']);

    showPrices.set(true);
    expect(labels()).toEqual(['ID', 'Cost', 'DP', 'Level', 'Price']);
  });
});
