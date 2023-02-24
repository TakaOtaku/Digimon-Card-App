import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { GoogleAuthProvider } from 'firebase/auth';
import firebase from 'firebase/compat';
import { MessageService } from 'primeng/api';
import { first, Subject } from 'rxjs';
import { IUser } from '../../models';
import { loadSave, setSave } from '../store/digimon.actions';
import { emptySettings } from '../store/reducers/save.reducer';
import { DigimonBackendService } from './digimon-backend.service';
import UserCredential = firebase.auth.UserCredential;
import User = firebase.User;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userData: IUser | null;

  public authChange = new Subject<boolean>();

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private digimonBackendService: DigimonBackendService,
    private messageService: MessageService,
    private store: Store
  ) {}

  get isLoggedIn(): boolean {
    return !!this.userData;
  }

  /**
   * Login automatically when you were logged in before
   */
  checkLocalStorage() {
    const userRAW = localStorage.getItem('user');
    if (!userRAW) return;

    this.userData = JSON.parse(userRAW);
  }

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result: UserCredential) => {
        this.SetUserData(result.user);
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

  LogOut() {
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
            '  sortDeckOrder: "Level"}}'
      );
      this.store.dispatch(loadSave({ save }));
    });
  }

  createUserData(user: User | null, save: any) {
    let userData: IUser;
    if (!save) {
      userData = {
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
      };
    } else {
      userData = {
        uid: user.uid,
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? '',
        save,
      };
    }

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
    this.store.dispatch(
      setSave({
        save: save ?? {
          uid: user.uid,
          photoURL: user.photoURL ?? '',
          displayName: user.displayName ?? '',
          version: 1,
          collection: [],
          decks: [],
          settings: emptySettings,
        },
      })
    );

    this.userData = userData;

    this.digimonBackendService
      .updateSave(this.userData.save)
      .pipe(first())
      .subscribe();

    this.authChange.next(true);
  }

  SetUserData(user: User | null) {
    if (!user) return;

    console.log('User-ID: ', user.uid);
    try{
      this.digimonBackendService
      .getSave(user.uid)
      .pipe(first())
      .subscribe((save: any) => {
        this.createUserData(user, save)
      })
    }catch(e){
      console.log(e)
      this.createUserData(user, null)
    }        
  }
}
