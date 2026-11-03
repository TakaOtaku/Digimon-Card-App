import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DialogStore, DigimonCardStore } from '@store';
import { GlobalSearchComponent } from './global-search.component';

const card = (id: string, cardNumber: string, name: string) => ({ id, cardNumber, name: { english: name } }) as any;

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;

  beforeEach(() => {
    const cards = [
      card('BT1-010', 'BT1-010', 'Agumon'),
      card('BT1-010_P1', 'BT1-010', 'Agumon'),
      card('BT1-011', 'BT1-011', 'Greymon'),
      ...Array.from({ length: 30 }, (_, i) => card(`EX1-${i}`, `EX1-${i}`, 'Gabumon')),
    ];
    TestBed.configureTestingModule({
      providers: [
        { provide: DigimonCardStore, useValue: { cards: signal(cards) } },
        { provide: DialogStore, useValue: { updateViewCardDialog: jest.fn() } },
      ],
    });
    component = TestBed.runInInjectionContext(() => new GlobalSearchComponent());
  });

  it('needs at least two characters', () => {
    component.query.set('a');
    expect(component.results()).toEqual([]);
  });

  it('matches name or number and shows each card number once', () => {
    component.query.set('agu');
    expect(component.results().map((c) => c.id)).toEqual(['BT1-010']);
    component.query.set('bt1-011');
    expect(component.results().map((c) => c.id)).toEqual(['BT1-011']);
  });

  it('caps results at 20', () => {
    component.query.set('gabu');
    expect(component.results().length).toBe(20);
  });
});
