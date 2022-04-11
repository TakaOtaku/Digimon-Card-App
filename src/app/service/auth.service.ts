import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Store} from "@ngrx/store";
import {GoogleAuthProvider} from 'firebase/auth';
import firebase from "firebase/compat";
import {MessageService} from "primeng/api";
import {first, Subject} from "rxjs";
import {IUser} from "../../models";
import {loadSave} from "../store/digimon.actions";
import {DatabaseService} from "./database.service";
import UserCredential = firebase.auth.UserCredential;
import User = firebase.User;


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userData: IUser | null;

  public authChange = new Subject<boolean>();

  get isLoggedIn(): boolean {return !!this.userData;}

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private dbService: DatabaseService,
    private messageService: MessageService,
    private store: Store
  ) {}

  checkLocalStorage() {
    const userRAW = localStorage.getItem('user');
    if (!userRAW) return;

    this.userData = JSON.parse(userRAW);
  }

  GoogleAuth() {return this.AuthLogin(new GoogleAuthProvider());}

  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result: UserCredential) => {
        this.SetUserData(result.user);
        this.messageService.add({
          severity: 'success',
          summary: 'Login Successfully!',
          detail: 'You have been logged in!'
        });
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failure!',
          detail: 'There was an failure with your Login. Please try again!'
        });
      });
  }

  LogOut() {
    return this.afAuth.signOut().then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Logout Successful!',
        detail: 'You have been logged out!'
      });
      localStorage.setItem('user', '');
      this.userData = null;
      this.authChange.next(true);

      const string = localStorage.getItem('Digimon-Card-Collector')
      const save = JSON.parse(string ?? '{collection:[], decks: [], settings: {cardSize: 50, collectionMode: true}}')
      this.store.dispatch(loadSave({save}));
    });
  }

  /**
   * Set the user data of the current User
   * a) If the db doesn't have an entry for the user create a new blank entry. And use the current Save if there is one
   * b) If the db does have an entry for the user load it and check it against the current save. Ask the User which one to keep.
   */
  SetUserData(user: User | null) {
    if (!user) return;

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );

    this.dbService.loadSave(user.uid).pipe(first())
      .subscribe(save => {
        const userData: IUser = {
          uid: user.uid,
          displayName: user.displayName ?? '',
          photoURL: user.photoURL ?? '',
          save
        };

        localStorage.setItem('user', JSON.stringify(userData));
        this.store.dispatch(loadSave({save}));

        this.userData = userData;

        userRef.set(userData, {merge: true});

        this.authChange.next(true);
      });
  }
}
