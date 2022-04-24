import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {get, getDatabase, ref, set, update} from "@angular/fire/database";
import {DataSnapshot} from "@firebase/database";
import {BehaviorSubject, first, Subject} from "rxjs";
import {IDeck, ISave, IUser} from "../../models";
import {CARDSET} from "../../models/card-set.enum";
import {emptySettings} from "../store/reducers/save.reducer";


@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(
    public database: AngularFireDatabase) {}

  /**
   * Falls der Nutzer eingeloggt ist und keine Daten hat, erstelle diese
   * Falls der Nutzer sich zum ersten mal einloggt erstelle neue Daten in der DB
   */
  loadSave(uId: string, user?: IUser | null): Subject<ISave> {
    const db = getDatabase();
    const saveSubject = new Subject<ISave>();

    this.database.object(`users/${uId}`).valueChanges().pipe(first()).subscribe((entry: any) => {
      if (entry) {
        let save = entry;

        save = this.checkSaveValidity(save, user);

        saveSubject.next(save);
      } else {
        const string = localStorage.getItem('Digimon-Card-Collector');
        if (string) {
          const save: ISave = JSON.parse(string)
          set(ref(db, 'users/' + uId), save);
          saveSubject.next(save);
          return;
        } else {
          set(ref(db, 'users/' + uId), {collection: [], decks: [], settings: emptySettings});
          saveSubject.next({collection: [], decks: [], settings: emptySettings});
        }
      }
    });

    return saveSubject;
  }

  /**
   * Check if the User has some data locally if the database didn't have them
   * If some setting is missing add it to the user
   * @param save
   * @param user
   */
  checkSaveValidity(save: any, user: any): ISave {
    if (user) {
      if(!save.collection) {save = {...save, collection: user.save.collection}}
      if(!save.decks) {save = {...save, decks: user.save.decks}}
      if(!save.settings) {save = {...save, settings: user.save.settings}}
    } else {
      if(!save.collection) {save = {...save, collection: []}}
      if(!save.decks) {save = {...save, decks: []}}
      if(!save.settings) {save = {...save, settings: emptySettings}}
    }

    if(save.settings.cardSet === undefined) {
      save = {...save, settings: {...save.settings, cardSet: CARDSET.BothOverwrite}}
    }
    if(save.settings.collectionMinimum === undefined) {
      save = {...save, settings: {...save.settings, collectionMinimum: 1}}
    }
    if(save.settings.showPreRelease === undefined) {
      save = {...save, settings: {...save.settings, showPreRelease: true}}
    }
    if(save.settings.showStampedCards === undefined) {
      save = {...save, settings: {...save.settings, showStampedCards: true}}
    }
    if(save.settings.showAACards === undefined) {
      save = {...save, settings: {...save.settings, showAACards: true}}
    }

    return save;
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
    const newDeck = {...deck, user: user?.displayName ?? 'Unknown', date: new Date()}
    return update(ref(db, 'community-decks/' + deck.id), newDeck);
  }

  loadCommunityDecks(): BehaviorSubject<IDeck[]> {
    const deckSubject = new BehaviorSubject<IDeck[]>([]);

    this.database.list(`community-decks`).valueChanges().pipe(first()).subscribe((entry: any) => {
      if (!entry) return;

      deckSubject.next(entry as IDeck[]);
    });

    return deckSubject;
  }
}
