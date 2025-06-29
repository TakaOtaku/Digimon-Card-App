import { Injectable, Signal, signal } from '@angular/core';
import {
  Auth,
  browserSessionPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  signOut,
  user,
  User,
} from '@angular/fire/auth';
import { emptySave, emptySettings, ISave, IUser } from '@models';
import { MessageService } from 'primeng/api';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { DigimonBackendService } from './digimon-backend.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSignal = signal<IUser | null>(null);
  // Use the user observable from the injected AngularFire Auth service
  firebaseUser$: Observable<User | null>;

  constructor(
    private firebaseAuth: Auth, // AngularFire Auth service is injected here
    private digimonBackendService: DigimonBackendService,
    private messageService: MessageService,
  ) {
    // Set persistence
    setPersistence(this.firebaseAuth, browserSessionPersistence);

    // Use the user observable provided by the injected AngularFire Auth service
    this.firebaseUser$ = user(this.firebaseAuth);

    // Initialize auth state handling
    this.initAuthState();
  }

  get isLoggedIn(): boolean {
    return this.userSignal() !== null;
  }

  get currentUser(): Signal<IUser | null> {
    return this.userSignal;
  }

  /**
   * Initialize the authentication state handling
   */
  private initAuthState(): void {
    this.firebaseUser$ // Now using the AngularFire user observable
      .pipe(
        switchMap((firebaseUser) => {
          if (!firebaseUser) {
            // User is logged out, clear state
            this.userSignal.set(null);
            return of(null);
          }

          // User is logged in, get save from backend
          return this.digimonBackendService.getSave(firebaseUser.uid).pipe(
            tap((save) => {
              if (save) {
                // Create user data object and update state
                const displayName = save.displayName ? save.displayName : firebaseUser.displayName;
                const photoURL = save.photoURL ? save.photoURL : firebaseUser.photoURL;
                const userData: IUser = {
                  uid: firebaseUser.uid,
                  displayName: displayName,
                  photoURL: photoURL,
                  save: this.ensureSaveHasUserInfo(save, firebaseUser),
                };

                // Update local storage and state
                localStorage.setItem('user', JSON.stringify(userData));
                this.userSignal.set(userData);

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
  async googleAuth(): Promise<any> {
    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: 'select_account',
      });

      const result = await signInWithPopup(this.firebaseAuth, provider);

      this.messageService.add({
        severity: 'success',
        summary: 'Login Successful!',
        detail: 'You have been logged in with Google!',
      });

      return result;
    } catch (error) {
      console.error('Google Auth Error:', error);

      // More specific error handling
      let errorMessage = 'Could not log in with Google';
      // Check if it's a known Firebase error structure
      if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
        errorMessage = `Authentication failed: ${error.message} (${error.code})`;
      } else if (error instanceof Error) {
        errorMessage = `Authentication failed: ${error.message}`;
      }

      this.messageService.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: errorMessage,
      });

      // Re-throw the error so the caller can handle it if needed
      throw error;
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

      this.userSignal.set(null);
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
    if (this.currentUser()) {
      // User is logged in, get save from backend
      return this.digimonBackendService.getSave(this.currentUser().uid).pipe(
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
  getLocalStorageSave(): ISave | null {
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
      displayName: save.displayName || user.displayName || '',
      photoURL: save.photoURL || user.photoURL || '',
    };
  }
}
