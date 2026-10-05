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

  it('getBlogEntries requests the blogs endpoint', () => {
    service.getBlogEntries().subscribe();
    const req = httpMock.expectOne(`${base}blogs`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
