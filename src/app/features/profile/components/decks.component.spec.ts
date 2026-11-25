import { TestBed } from '@angular/core/testing';
import { emptyDeck, IDeck } from '@models';
import { DialogStore, DigimonCardStore, SaveStore } from '@store';
import { DecksComponent } from './decks.component';

describe('DecksComponent', () => {
  it('lists only the decks of the current mode', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DialogStore, useValue: {} },
        { provide: SaveStore, useValue: { settings: () => ({}) } },
      ],
    });
    const store = TestBed.inject(DigimonCardStore);
    const component = TestBed.runInInjectionContext(() => new DecksComponent());
    const old: IDeck = { ...emptyDeck, id: 'old' };
    const alysion: IDeck = { ...emptyDeck, id: 'aly', format: 'alysion' };
    component.decks = [old, alysion];

    expect(component.decks.map((d) => d.id)).toEqual(['old']);
    expect(component.decksToShow.map((d) => d.id)).toEqual(['old']);

    store.updateFormat('alysion');
    expect(component.decks.map((d) => d.id)).toEqual(['aly']);
    expect(component.decksToShow.map((d) => d.id)).toEqual(['aly']);
  });
});
