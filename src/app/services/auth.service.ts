import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import firebase from 'firebase/compat';
import { MessageService } from 'primeng/api';
import { catchError, first, Observable, of, retry, Subject } from 'rxjs';
import { ISave, IUser } from '../../models';
import { emptySave, emptySettings } from '../../models';
import { SaveStore } from '../store/save.store';
import { DigimonBackendService } from './digimon-backend.service';
import UserCredential = firebase.auth.UserCredential;
import User = firebase.User;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: IUser | null;
  authChange = new Subject<boolean>();

  constructor(
    public afAuth: AngularFireAuth,
    private digimonBackendService: DigimonBackendService,
    private messageService: MessageService,
  ) {}

  get isLoggedIn(): boolean {
    return !!this.userData;
  }

  /**
   * Login automatically when you were logged in before
   */
  userInLocalStorage(): boolean {
    const userRAW = localStorage.getItem('user');
    if (!userRAW) return false;

    this.userData = JSON.parse(userRAW);
    return true;
  }

  GoogleAuth(saveStore: any) {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    return this.AuthLogin(provider, saveStore);
  }

  AuthLogin(provider: any, saveStore: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result: UserCredential) => {
        this.SetUserData(result.user, saveStore);
        this.messageService.add({
          severity: 'success',
          summary: 'Login Successfully!',
          detail: 'You have been logged in!',
        });
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failure!',
          detail: 'There was an failure with your Login. Please try again!',
        });
      });
  }

  LogOut(saveStore: any) {
    return this.afAuth.signOut().then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Logout Successful!',
        detail: 'You have been logged out!',
      });
      localStorage.setItem('user', '');
      this.userData = null;
      this.authChange.next(true);

      const string = localStorage.getItem('Digimon-Card-Collector');
      const save = JSON.parse(
        string ??
          '{version: 1, collection:[], decks: [], settings: {cardSize: 50, collectionMode: false, collectionMode: false, collectionMinimum: 1,' +
            '  showPreRelease: true,' +
            '  showStampedCards: true,' +
            '  showAACards: true,' +
            '  sortDeckOrder: "Level"}}',
      );
      saveStore.updateSave(save);
    });
  }

  createUserData(user: User, save: any, saveStore: any) {
    let userData: IUser = !save
      ? {
          uid: user.uid,
          displayName: user.displayName ?? '',
          photoURL: user.photoURL ?? '',
          save: {
            uid: user.uid,
            photoURL: user.photoURL ?? '',
            displayName: user.displayName ?? '',
            version: 1,
            collection: [],
            decks: [],
            settings: emptySettings,
          },
        }
      : {
          uid: user.uid,
          displayName: user.displayName ?? '',
          photoURL: user.photoURL ?? '',
          save,
        };

    if (!userData.save.uid) {
      userData.save.uid = user.uid;
    }
    if (!userData.save.displayName) {
      userData.save.displayName = user.displayName ?? '';
    }
    if (!userData.save.photoURL) {
      userData.save.photoURL = user.photoURL ?? '';
    }

    localStorage.setItem('user', JSON.stringify(userData));
    saveStore.updateSave(
      save ?? {
        uid: user.uid,
        photoURL: user.photoURL ?? '',
        displayName: user.displayName ?? '',
        version: 1,
        collection: [],
        decks: [],
        settings: emptySettings,
      },
    );

    this.userData = userData;

    this.digimonBackendService
      .updateSave(this.userData.save)
      .pipe(first())
      .subscribe();

    this.authChange.next(true);
  }

  SetUserData(user: User | null, saveStore: any) {
    if (!user) return;
    // eslint-disable-next-line no-console
    console.log('User-ID: ', user.uid);
    this.digimonBackendService
      .getSave(user.uid)
      .pipe(
        first(),
        catchError((e) => {
          // eslint-disable-next-line no-console
          console.log('No save found creating a new one!');
          this.createUserData(user, this.getLocalStorageSave(), saveStore);
          return of(null);
        }),
      )
      .subscribe((save: ISave | null) => {
        if (!save) {
          return;
        }
        this.createUserData(user, save, saveStore);
      });
  }

  /**
   * Load the User-Save from the backend or local storage
   * Check if the user is in the cache, load the save from the backend.
   * Otherwise, check the local storage for an offline save or create a new save.
   */
  loadSave(): Observable<ISave> {
    if (!this.userInLocalStorage()) {
      return this.loadLocalStorageSave();
    }

    return this.digimonBackendService
      .getSave(this.userData!.uid)
      .pipe(retry(5));
  }

  // Check local storage for a backup save, if there is none create a new save
  private loadLocalStorageSave(): Observable<ISave> {
    const localStorageItem = localStorage.getItem('Digimon-Card-Collector');
    let localStorageSave: ISave | null = localStorageItem
      ? JSON.parse(localStorageItem)
      : null;

    if (localStorageSave) {
      localStorageSave =
        this.digimonBackendService.checkSaveValidity(localStorageSave);
      return of(localStorageSave);
    }
    return of(emptySave);
  }

  private getLocalStorageSave(): ISave {
    const localStorageItem = localStorage.getItem('Digimon-Card-Collector');
    let localStorageSave: ISave | null = localStorageItem
      ? JSON.parse(localStorageItem)
      : null;
    return localStorageSave || emptySave;
  }
}
