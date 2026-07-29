import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { of, throwError } from 'rxjs';
import { MongoBackendService } from './mongo-backend.service';

let mockUserSubject = new Subject<any>();

jest.mock('@angular/fire/auth', () => ({
  Auth: class Auth {},
  user: () => mockUserSubject,
  GoogleAuthProvider: class {
    setCustomParameters = jest.fn();
  },
  signInWithPopup: jest.fn(() => Promise.resolve({ user: { uid: 'user-1' } })),
  signOut: jest.fn(() => Promise.resolve()),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserLocalPersistence: {},
}));

import { Auth } from '@angular/fire/auth';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mongo: { getSave: jest.Mock; updateSave: jest.Mock };
  let messages: { add: jest.Mock };

  beforeEach(() => {
    localStorage.clear();
    mockUserSubject = new Subject<any>();
    mongo = { getSave: jest.fn(), updateSave: jest.fn(() => of({})) };
    messages = { add: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: {} },
        { provide: MongoBackendService, useValue: mongo },
        { provide: MessageService, useValue: messages },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('starts logged out', () => {
    expect(service.isLoggedIn).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('clears state on logout', async () => {
    await service.logOut();
    expect(service.currentUser()).toBeNull();
    expect(messages.add).toHaveBeenCalledWith(expect.objectContaining({ severity: 'success' }));
  });

  it('loads an existing save without pushing it back to the backend', () => {
    mongo.getSave.mockReturnValue(of({ uid: 'user-1', displayName: 'Existing', collection: [], decks: [], settings: {} }));
    mockUserSubject.next({ uid: 'user-1', displayName: 'FB', photoURL: 'p.png' });

    expect(service.currentUser()?.uid).toBe('user-1');
    expect(mongo.updateSave).not.toHaveBeenCalled();
  });

  it('creates a new save once on first login (404)', () => {
    mongo.getSave.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    mockUserSubject.next({ uid: 'user-2', displayName: 'New', photoURL: 'p.png' });

    expect(service.currentUser()?.uid).toBe('user-2');
    expect(mongo.updateSave).toHaveBeenCalledTimes(1);
  });

  it('clears the user when firebase reports a logout', () => {
    mongo.getSave.mockReturnValue(of({ uid: 'user-1', collection: [], decks: [], settings: {} }));
    mockUserSubject.next({ uid: 'user-1', displayName: 'A', photoURL: '' });
    expect(service.currentUser()).not.toBeNull();

    mockUserSubject.next(null);
    expect(service.currentUser()).toBeNull();
  });
});
