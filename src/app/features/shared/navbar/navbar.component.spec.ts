import { TestBed } from '@angular/core/testing';
import { SaveStore } from '../../../store/save.store';
import { environment } from '../../../../environments/environment';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  it('exposes the configured app URL for the logo link', () => {
    TestBed.configureTestingModule({ providers: [{ provide: SaveStore, useValue: {} }] });
    const component = TestBed.runInInjectionContext(() => new NavbarComponent());
    expect((component as any).appUrl).toBe(environment.appUrl);
  });
});
