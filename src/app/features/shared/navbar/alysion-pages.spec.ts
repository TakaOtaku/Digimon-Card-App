import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '@services';
import { DialogStore, SaveStore } from '@store';
import { MessageService } from 'primeng/api';
import { emptySave } from '../../../../models';
import { paperOnlyGuard } from '../../../paper-only.guard';
import { AlysionModeService } from '../../../services/alysion-mode.service';
import { MongoBackendService } from '../../../services/mongo-backend.service';
import { NavLinksComponent } from './nav-links.component';
import { NavbarComponent } from './navbar.component';

const PAPER_ONLY = ['/collection', '/rulings', '/products'];

describe('paper-only pages', () => {
  const navigateByUrl = jest.fn();
  let path = '/collection';

  beforeEach(() => {
    navigateByUrl.mockClear();
    TestBed.configureTestingModule({
      providers: [
        { provide: MessageService, useValue: {} },
        { provide: AuthService, useValue: { currentUser: () => null } },
        { provide: DialogStore, useValue: {} },
        { provide: MongoBackendService, useValue: { getDecksPaginated: () => ({ pipe: () => undefined }) } },
        { provide: Location, useValue: { path: () => path } },
        { provide: Router, useValue: { events: { pipe: () => ({ subscribe: () => undefined }) }, navigateByUrl, createUrlTree: (c: string[]) => c.join('') as unknown as UrlTree } },
      ],
    });
  });

  const alysion = (on: boolean) => TestBed.inject(SaveStore).updateSettings({ ...emptySave.settings, alysionMode: on, collectionMode: true });

  it('drops their links from every menu in Alysion mode', () => {
    const links = TestBed.runInInjectionContext(() => new NavLinksComponent());
    const bar = TestBed.runInInjectionContext(() => new NavbarComponent()) as any;
    const urls = () => [
      ...links.sheetLinks().map((l) => l.url),
      ...links.moreItems().map((i) => i.routerLink).filter(Boolean),
      ...bar.mobileLinks().map((l: { url: string }) => l.url),
    ];

    alysion(false);
    expect(urls()).toEqual(expect.arrayContaining(PAPER_ONLY));
    alysion(true);
    expect(urls().filter((url) => PAPER_ONLY.includes(url))).toEqual([]);
    expect(urls()).toContain('/decks');
  });

  it('turns the collection mode off in Alysion mode', () => {
    alysion(true);
    expect(TestBed.inject(SaveStore).collectionMode()).toBe(false);
    alysion(false);
    expect(TestBed.inject(SaveStore).collectionMode()).toBe(true);
  });

  it('sends their routes to the card search in Alysion mode', () => {
    const guard = () => TestBed.runInInjectionContext(() => paperOnlyGuard({} as any, {} as any));
    alysion(false);
    expect(guard()).toBe(true);
    alysion(true);
    expect(guard()).toBe('/cards');
  });

  it('leaves such a page when the mode switches to Alysion on it', () => {
    const service = TestBed.inject(AlysionModeService);
    for (const open of ['/collection/some-user', '/rulings', '/products']) {
      path = open;
      service.setMode('paper');
      service.setMode('alysion');
      expect(navigateByUrl).toHaveBeenLastCalledWith('/cards');
    }
    navigateByUrl.mockClear();
    path = '/decks';
    service.setMode('alysion');
    expect(navigateByUrl).not.toHaveBeenCalled();
  });
});
