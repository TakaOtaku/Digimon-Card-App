import {Injectable, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from "firebase/compat";
import {MessageService} from "primeng/api";
import {Subject} from "rxjs";
import {IUser} from "../../models";
import User = firebase.User;


@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  public userData: IUser | null;

  public authChange = new Subject<boolean>();

  constructor(
    public afs: AngularFirestore,
    private messageService: MessageService,
    public afAuth: AngularFireAuth // Inject Firebase auth service
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
        this.authChange.next(true);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  ngOnInit() {
    const user = localStorage.getItem('user')
    if(!user) {return}
    this.userData = JSON.parse(user);
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.SetUserData(result.user);
        this.messageService.add({severity:'success', summary:'Login Successfully!', detail:'You have been logged in!!'});
      })
      .catch((error) => {
        this.messageService.add({severity:'error', summary:'Login Failure!', detail:'There was an failure with your Login. Please try again!'});
      });
  }

  SetUserData(user: User|null) {
    if(!user) {return;}
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: IUser = {
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? '',
      save: {collection:[], decks: [], settings: {cardSize: 50, collectionMode: true}}
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  get isLoggedIn(): boolean {
    return this.userData !== null && this.userData !== undefined;
  }
}
