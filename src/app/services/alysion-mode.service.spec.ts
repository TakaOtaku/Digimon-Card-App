import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { emptyDeck, emptySave, IDeck } from '../../models';
import { FilterStore } from '../store/filter.store';
import { SaveStore } from '../store/save.store';
import { WebsiteStore } from '../store/website.store';
import { AlysionModeService } from './alysion-mode.service';
import { AuthService } from './auth.service';
import { MongoBackendService } from './mongo-backend.service';

const deck = (id: string, format?: 'paper' | 'alysion'): IDeck => ({ ...emptyDeck, id, cards: [{ id: 'BT1-010', count: 1 }], format });

describe('AlysionModeService', () => {
  let service: AlysionModeService;
  let save: InstanceType<typeof SaveStore>;
  let website: InstanceType<typeof WebsiteStore>;
  let filters: InstanceType<typeof FilterStore>;
  const withSettings = (changes: object) => save.updateSettings({ ...emptySave.settings, ...changes });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MessageService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: MongoBackendService, useValue: {} },
      ],
    });
    service = TestBed.inject(AlysionModeService);
    save = TestBed.inject(SaveStore);
    website = TestBed.inject(WebsiteStore);
    filters = TestBed.inject(FilterStore);
  });

  it('treats settings without alysionMode as paper', () => {
    const { alysionMode, ...old } = emptySave.settings;
    save.updateSettings(old);
    service.syncFromSave();
    expect(service.mode()).toBe('paper');
  });

  it('keeps one draft and one filter per mode', () => {
    website.updateDeck(deck('paper-draft'));
    filters.updateSetFilter(['BT10']);

    service.setMode('alysion');
    expect(website.deck().cards).toEqual([]);
    expect(website.deck().format).toBe('alysion');
    expect(filters.setFilter()).toEqual([]);
    expect(website.decksFilter().format).toBe('alysion');
    filters.updateSetFilter(['BD01']);

    service.setMode('paper');
    expect(website.deck().id).toBe('paper-draft');
    expect(filters.setFilter()).toEqual(['BT10']);

    service.setMode('alysion');
    expect(filters.setFilter()).toEqual(['BD01']);
  });

  it('opening a deck switches to its format', () => {
    service.openDeck(deck('saved', 'alysion'));
    expect(service.mode()).toBe('alysion');
    expect(save.settings().alysionMode).toBe(true);
    expect(website.deck().id).toBe('saved');
  });

  it('keeps a deck opened before the save loaded', () => {
    service.openDeck(deck('from-url'));
    withSettings({ alysionMode: true }); // the loaded save replaces the settings
    service.syncFromSave();
    expect(service.mode()).toBe('paper');
    expect(website.deck().id).toBe('from-url');
    expect(save.settings().alysionMode).toBe(false);
  });

  it('applies the saved mode, and later setting changes', () => {
    withSettings({ alysionMode: true });
    service.syncFromSave();
    expect(service.mode()).toBe('alysion');
    withSettings({ alysionMode: false });
    service.syncFromSave();
    expect(service.mode()).toBe('paper');
  });

  it('stamps new decks with the current format', () => {
    service.setMode('alysion');
    website.createNewDeck('new');
    expect(website.deck().format).toBe('alysion');
  });

  it('hides prices in Alysion mode', () => {
    withSettings({ showPrices: true });
    expect(save.showPrices()).toBe(true);
    service.setMode('alysion');
    expect(save.showPrices()).toBe(false);
  });
});
