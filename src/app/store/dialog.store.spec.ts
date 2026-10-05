import { TestBed } from '@angular/core/testing';
import { DialogStore } from './dialog.store';

describe('DialogStore', () => {
  let store: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(DialogStore);
  });

  it('has sensible initial state', () => {
    expect(store.changelog()).toBe(false);
    expect(store.settings()).toBe(false);
    expect(store.viewCard().show).toBe(false);
  });

  it('toggles the changelog dialog', () => {
    store.updateChangelogDialog(true);
    expect(store.changelog()).toBe(true);
  });

  it('toggles the settings dialog', () => {
    store.updateSettingsDialog(true);
    expect(store.settings()).toBe(true);
  });

  it('shows the view-card dialog while preserving other card state', () => {
    const before = store.viewCard().card;
    store.showViewCardDialog(true);
    expect(store.viewCard().show).toBe(true);
    expect(store.viewCard().card).toBe(before);
  });
});
