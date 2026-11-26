import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { emptySave } from '../../models';
import { CollectionExportComponent } from '../features/shared/dialogs/settings-dialog/collection-export.component';
import { onlyModeChanged } from '../functions/alysion.functions';
import { DigimonCardStore } from '../store/digimon-card.store';
import { FilterStore } from '../store/filter.store';
import { SaveStore } from '../store/save.store';
import { AlysionModeService } from './alysion-mode.service';
import { AuthService } from './auth.service';
import { MongoBackendService } from './mongo-backend.service';

describe('Alysion mode and the rest of the settings', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MessageService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: MongoBackendService, useValue: { getDecksPaginated: () => of({ data: [], pagination: {} }) } },
      ],
    });
  });

  it('tells a mode switch apart from other setting changes', () => {
    const settings = emptySave.settings;
    expect(onlyModeChanged(settings, { ...settings, alysionMode: true })).toBe(true);
    expect(onlyModeChanged(settings, { ...settings, showAACards: true, alysionMode: true })).toBe(false);
    expect(onlyModeChanged(null, settings)).toBe(false);
  });

  it('applies the version settings to the filters of both modes, then keeps each choice', () => {
    const filters = TestBed.inject(FilterStore);
    filters.updateVersionDefaults(['Normal']);
    filters.switchFormat('alysion');
    expect(filters.versionFilter()).toEqual(['Normal']);
    filters.updateVersionFilter(['Alternative Art']);
    filters.switchFormat('paper');
    expect(filters.versionFilter()).toEqual(['Normal']);
    filters.switchFormat('alysion');
    expect(filters.versionFilter()).toEqual(['Alternative Art']);
  });

  it('keeps the search of a shared link when the saved mode loads', () => {
    const save = TestBed.inject(SaveStore);
    const filters = TestBed.inject(FilterStore);
    const mode = TestBed.inject(AlysionModeService);
    filters.updateAdvancedSearch('agumon');
    save.updateSettings({ ...emptySave.settings, alysionMode: true });
    mode.syncFromSave();
    expect(mode.mode()).toBe('alysion');
    expect(filters.advancedSearch()).toBe('agumon');
    mode.setMode('paper');
    expect(filters.advancedSearch()).toBeNull();
  });

  it('exports the whole collection while in Alysion mode', async () => {
    const raw = (id: string) => ({ id, cardNumber: id, cardImage: '', name: { japanese: 'x' }, restrictions: {}, rarity: 'C', version: 'Normal' });
    jest.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const cards = String(url).includes('Alysion') ? [] : [raw('BT1-010'), raw('BT5-001')];
      return { ok: true, json: async () => cards } as Response;
    });
    const cards = TestBed.inject(DigimonCardStore);
    await cards.updateCards('English' as any);
    cards.updateFormat('alysion');
    const component = TestBed.runInInjectionContext(() => new CollectionExportComponent()) as any;
    expect(component.setupAllCards().map((card: { id: string }) => card.id)).toEqual(['BT1-010', 'BT5-001']);
    jest.restoreAllMocks();
  });
});
