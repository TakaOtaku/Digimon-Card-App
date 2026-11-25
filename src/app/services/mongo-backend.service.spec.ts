import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { MongoBackendService } from './mongo-backend.service';

describe('MongoBackendService', () => {
  let service: MongoBackendService;
  let httpMock: HttpTestingController;
  const base = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MongoBackendService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MongoBackendService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getSave requests the user endpoint and returns a save', () => {
    let result: any;
    service.getSave('user-1').subscribe((s) => (result = s));
    const req = httpMock.expectOne(`${base}users/user-1`);
    expect(req.request.method).toBe('GET');
    req.flush({ uid: 'user-1', collection: [], decks: [], settings: {} });
    expect(result.uid).toBe('user-1');
  });

  it('updateSave PUTs to the user endpoint', () => {
    service
      .updateSave({ uid: 'user-1', collection: [], decks: [], settings: {} } as any)
      .subscribe();
    const req = httpMock.expectOne(`${base}users/user-1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('asks for decks of one format', () => {
    service.getDecksPaginated({ format: 'alysion' }).subscribe();
    httpMock.expectOne((r) => r.url.includes('format=alysion')).flush([]);
  });

  it('asks for top decks of one format only when given', () => {
    service.getTopDecks(4, 'paper').subscribe();
    httpMock.expectOne(`${base}decks/top?limit=4&format=paper`).flush([]);
    service.getTopDecks(10).subscribe();
    httpMock.expectOne(`${base}decks/top?limit=10`).flush([]);
  });

  it('sends the format of a deck, paper when it has none', () => {
    for (const [format, sent] of [['alysion', 'alysion'], [undefined, 'paper']]) {
      service.updateDeck({ id: 'd', imageCardId: 'BT1-010', cards: [], format } as any, null, []).subscribe();
      const req = httpMock.expectOne(`${base}decks/d`);
      expect(req.request.body.format).toBe(sent);
      req.flush({});
    }
  });

  it('keeps the format of every deck in a save', () => {
    service.updateSave({ uid: 'u', collection: [], settings: {}, decks: [{ id: 'a' }, { id: 'b', format: 'alysion' }] } as any).subscribe();
    const req = httpMock.expectOne(`${base}users/u`);
    expect(req.request.body.decks.map((d: any) => d.format)).toEqual([undefined, 'alysion']);
    req.flush({});
  });

  it('getBlogEntries requests the blogs endpoint', () => {
    service.getBlogEntries().subscribe();
    const req = httpMock.expectOne(`${base}blogs`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
