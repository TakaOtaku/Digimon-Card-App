import { Injectable } from '@angular/core';
import { Auth, browserSessionPersistence, setPersistence, signInWithPopup, signOut, user, User } from '@angular/fire/auth';
import { emptySave, emptySettings, ISave, IUser } from '@models';
import { GoogleAuthProvider } from 'firebase/auth';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { DigimonBackendService } from './digimon-backend.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<IUser | null>(null);
  user$ = this.userSubject.asObservable();
  firebaseUser$: Observable<User | null>;

  constructor(
    private firebaseAuth: Auth,
    private digimonBackendService: DigimonBackendService,
    private messageService: MessageService,
  ) {
    // Set persistence
    setPersistence(this.firebaseAuth, browserSessionPersistence);

    // Stream of Firebase user
    this.firebaseUser$ = user(this.firebaseAuth);

    // Initialize auth state handling
    this.initAuthState();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user));
  }

  get currentUser(): IUser | null {
    return this.userSubject.value;
  }

  /**
   * Initialize the authentication state handling
   */
  private initAuthState(): void {
    this.firebaseUser$
      .pipe(
        switchMap((firebaseUser) => {
          if (!firebaseUser) {
            // User is logged out, clear state
            this.userSubject.next(null);
            return of(null);
          }

          // User is logged in, get save from backend
          return this.digimonBackendService.getSave(firebaseUser.uid).pipe(
            catchError(() => {
              console.log('No save found, creating a new one');
              // Use local save if available, otherwise create empty
              const localSave = this.getLocalStorageSave();
              return of(this.createNewSave(firebaseUser, localSave));
            }),
            tap((save) => {
              if (save) {
                // Create user data object and update state
                const userData: IUser = {
                  uid: firebaseUser.uid,
                  displayName: firebaseUser.displayName || '',
                  photoURL: firebaseUser.photoURL || '',
                  save: this.ensureSaveHasUserInfo(save, firebaseUser),
                };

                // Update local storage and state
                localStorage.setItem('user', JSON.stringify(userData));
                this.userSubject.next(userData);

                // Ensure save is up to date in backend
                this.digimonBackendService.updateSave(userData.save).subscribe();
              }
            }),
          );
        }),
      )
      .subscribe();
  }

  /**
   * Sign in with Google
   */
  async googleAuth(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.firebaseAuth, provider);
      this.messageService.add({
        severity: 'success',
        summary: 'Login Successful!',
        detail: 'You have been logged in with Google!',
      });
    } catch (error) {
      console.error('Google Auth Error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Could not log in with Google',
      });
    }
  }

  /**
   * Sign out
   */
  async logOut(): Promise<void> {
    try {
      await signOut(this.firebaseAuth);
      this.messageService.add({
        severity: 'success',
        summary: 'Logout Successful!',
        detail: 'You have been logged out!',
      });

      // Clear session storage
      sessionStorage.clear();

      // Load local save for offline use
      const localSave = this.getLocalStorageSave();
      if (localSave) {
        // Notify application about save change
        // Note: You'll need to implement this in your save store
        // saveStore.updateSave(localSave);
      }
    } catch (error) {
      console.error('Logout Error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Logout Failed',
        detail: 'Could not log out',
      });
    }
  }

  /**
   * Load the current save - used on application init
   */
  loadSave(): Observable<ISave> {
    const currentUser = this.currentUser;

    if (currentUser) {
      // User is logged in, get save from backend
      return this.digimonBackendService.getSave(currentUser.uid).pipe(
        catchError(() => {
          console.log('Failed to load save from backend, using local save');
          return of(this.getLocalStorageSave() || emptySave);
        }),
      );
    }

    // No user logged in, use local save
    return of(this.getLocalStorageSave() || emptySave);
  }

  /**
   * Get save from local storage
   */
  private getLocalStorageSave(): ISave | null {
    const localStorageItem = localStorage.getItem('Digimon-Card-Collector');
    if (!localStorageItem) return null;

    try {
      const localSave = JSON.parse(localStorageItem);
      return this.digimonBackendService.checkSaveValidity(localSave);
    } catch (e) {
      console.error('Error parsing local save:', e);
      return null;
    }
  }

  /**
   * Create a new save object for a user
   */
  private createNewSave(user: User, existingSave: ISave | null): ISave {
    if (existingSave) {
      return this.ensureSaveHasUserInfo(existingSave, user);
    }

    return {
      uid: user.uid,
      photoURL: user.photoURL || '',
      displayName: user.displayName || '',
      version: 1,
      collection: [],
      decks: [],
      settings: emptySettings,
    };
  }

  /**
   * Ensure save has user information
   */
  private ensureSaveHasUserInfo(save: ISave, user: User): ISave {
    return {
      ...save,
      uid: user.uid,
      displayName: user.displayName || save.displayName || '',
      photoURL: user.photoURL || save.photoURL || '',
    };
  }
}
