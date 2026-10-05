import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  function setup(currentUser: any) {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Auth, useValue: { currentUser } },
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => httpMock.verify());

  it('attaches a bearer token to API requests when authenticated', fakeAsync(() => {
    setup({ getIdToken: () => Promise.resolve('tok-123') });
    httpClient.get(`${environment.apiBaseUrl}decks`).subscribe();
    tick();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}decks`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok-123');
    req.flush({});
  }));

  it('does not attach a token to non-API requests', fakeAsync(() => {
    setup({ getIdToken: () => Promise.resolve('tok') });
    httpClient.get('https://other.example/data').subscribe();
    tick();
    const req = httpMock.expectOne('https://other.example/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  }));

  it('proceeds without a token when not authenticated', fakeAsync(() => {
    setup(null);
    httpClient.get(`${environment.apiBaseUrl}decks`).subscribe();
    tick();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}decks`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  }));

  it('proceeds without a token when getIdToken fails', fakeAsync(() => {
    setup({ getIdToken: () => Promise.reject(new Error('expired')) });
    httpClient.get(`${environment.apiBaseUrl}decks`).subscribe();
    tick();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}decks`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  }));
});
