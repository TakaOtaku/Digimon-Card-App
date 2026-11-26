import { TestBed } from '@angular/core/testing';
import { DigimonCardStore, FilterStore } from '@store';
import { SetFilterComponent } from './set-filter.component';

describe('SetFilterComponent', () => {
  let component: SetFilterComponent;

  beforeEach(() => {
    component = TestBed.runInInjectionContext(() => new SetFilterComponent());
  });

  const titles = () => component.groupedSets().map((group) => group.label);
  const shown = () => component.groupedSets().flatMap((group) => group.items.map((item) => item.value));
  const openAll = () => component.groupedSets().forEach((group) => component.toggle(group.value));

  it('starts with every titled group collapsed', () => {
    expect(titles()).toEqual(['Standard', 'Extra', 'Starter Decks', 'Bonus', 'Alysion']);
    expect(shown()).toEqual([]);
  });

  it('opens and closes one group at a time', () => {
    component.toggle('bonus');
    expect(shown()).toEqual(['AD1', 'LM', 'P', 'RB1']);
    component.toggle('bonus');
    expect(shown()).toEqual([]);
  });

  it('keeps selected sets visible in a collapsed group', () => {
    TestBed.inject(FilterStore).updateSetFilter(['BT5']);
    expect(shown()).toEqual(['BT5']);
    TestBed.tick();
    expect(component.setFilter).toEqual(['BT5']);
  });

  it('offers the Alysion sets on the paper site, and only pool sets in Alysion mode', () => {
    openAll();
    expect(shown()).toEqual(expect.arrayContaining(['BT1', 'BT5', 'BD01', 'SD02']));

    TestBed.inject(DigimonCardStore).updateFormat('alysion');
    expect(shown()).toEqual(expect.arrayContaining(['BT1', 'ST6', 'BD01', 'SD02']));
    expect(shown()).not.toContain('BT5');
    expect(titles()).toEqual(['Standard', 'Starter Decks', 'Alysion']);
  });
});
