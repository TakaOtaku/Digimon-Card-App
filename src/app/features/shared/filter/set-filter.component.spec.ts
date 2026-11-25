import { TestBed } from '@angular/core/testing';
import { DigimonCardStore, FilterStore } from '@store';
import { SetFilterComponent } from './set-filter.component';

describe('SetFilterComponent', () => {
  it('offers the sets of the current mode and follows the filter', () => {
    const cards = TestBed.inject(DigimonCardStore);
    const filters = TestBed.inject(FilterStore);
    const component = TestBed.runInInjectionContext(() => new SetFilterComponent());
    const sets = () => component.groupedSets().flatMap((group) => group.items.map((item) => item.value));

    expect(sets()).toEqual(expect.arrayContaining(['BT1', 'BT5']));
    expect(sets()).not.toContain('BD01');

    cards.updateFormat('alysion');
    expect(sets()).toEqual(expect.arrayContaining(['BT1', 'ST6', 'BD01', 'SD02']));
    expect(sets()).not.toContain('BT5');
    expect(component.groupedSets().every((group) => group.items.length > 0)).toBe(true);

    filters.updateSetFilter(['BD01']);
    TestBed.tick();
    expect(component.setFilter).toEqual(['BD01']);
  });
});
