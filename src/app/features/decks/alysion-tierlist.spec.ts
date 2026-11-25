import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Database } from '@angular/fire/database';
import { provideRouter } from '@angular/router';
import { MongoBackendService } from '@services';
import { DigimonCardStore, SaveStore, WebsiteStore } from '@store';
import { of } from 'rxjs';
import { HomeMetaComponent } from '../home/components/home-meta.component';

jest.mock('@angular/fire/database', () => ({
  Database: class {},
  ref: () => ({}),
  get: () => Promise.resolve({ val: () => [[{ name: 'Omnimon', image: '', card: 'BT1-084' }]] }),
}));

describe('tier list in Alysion mode', () => {
  it('is not shown on the home page', async () => {
    const alysionMode = signal(false);
    TestBed.configureTestingModule({
      imports: [HomeMetaComponent],
      providers: [
        provideRouter([]),
        { provide: Database, useValue: {} },
        { provide: WebsiteStore, useValue: {} },
        { provide: SaveStore, useValue: { alysionMode } },
        { provide: DigimonCardStore, useValue: { format: signal('paper'), cardsMap: () => new Map() } },
        { provide: MongoBackendService, useValue: { getTopDecks: () => of([]) } },
      ],
    });
    const fixture = TestBed.createComponent(HomeMetaComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Omnimon');

    alysionMode.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Omnimon');
  });
});
