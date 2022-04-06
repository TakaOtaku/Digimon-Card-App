import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {get, getDatabase, ref, set, update} from "@angular/fire/database";
import {DataSnapshot} from "@firebase/database";
import {BehaviorSubject, first, Subject} from "rxjs";
import {IDeck, ISave, IUser} from "../../models";


@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(public database: AngularFireDatabase) {
  }

  /**
   * Falls der Nutzer eingeloggt ist und keine Daten hat, erstelle diese
   * Falls der Nutzer sich zum ersten mal einloggt erstelle neue Daten in der DB
   */
  loadSave(uId: string): Subject<ISave> {
    const db = getDatabase();

    const saveSubject = new Subject<ISave>();

    this.database.object(`users/${uId}`).valueChanges().pipe(first()).subscribe((entry: any) => {
      if (entry) {
        saveSubject.next(entry);
      } else {
        const string = localStorage.getItem('Digimon-Card-Collector')
        if (string) {
          const save: ISave = JSON.parse(string)
          set(ref(db, 'users/' + uId), save);
          saveSubject.next(save);
          return;
        } else {
          set(ref(db, 'users/' + uId), {collection: [], decks: [], settings: {cardSize: 50, collectionMode: true}});
          saveSubject.next({collection: [], decks: [], settings: {cardSize: 50, collectionMode: true}});
        }
      }
    });

    return saveSubject;
  }

  setSave(uId: string, save: ISave) {
    const db = getDatabase();

    return update(ref(db, 'users/' + uId), save);
  }

  checkEntry(uId: string): Promise<DataSnapshot> {
    const db = getDatabase();
    return get(ref(db, `users/${uId}`))
  }

  shareDeck(deck: IDeck, user: IUser | null) {
    const db = getDatabase();

    const newDeck = {...deck, user: user?.displayName ?? 'Unknown'}

    return update(ref(db, 'community-decks/' + deck.id), newDeck);
  }

  loadCommunityDecks(): BehaviorSubject<IDeck[]> {
    const deckSubject = new BehaviorSubject<IDeck[]>([]);

    this.database.list(`community-decks`).valueChanges().pipe(first()).subscribe((entry: any) => {
      if (!entry) { return }
      deckSubject.next(entry as IDeck[]);
    });

    return deckSubject;
  }
}
