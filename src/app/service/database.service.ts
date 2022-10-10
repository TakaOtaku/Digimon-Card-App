import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { get, getDatabase, ref, remove, update } from '@angular/fire/database';
import { BehaviorSubject, first, from, Observable, Subject } from 'rxjs';
import { IDeck, ISave, IUser } from '../../models';
import { CARDSET } from '../../models/card-set.enum';
import { IBlog } from '../../models/interfaces/blog-entry.interface';
import { emptyDeck } from '../store/reducers/digimon.reducers';
import { emptySettings } from '../store/reducers/save.reducer';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(public database: AngularFireDatabase) {}

  /**
   * Falls der Nutzer eingeloggt ist und keine Daten hat, erstelle diese
   * Falls der Nutzer sich zum ersten mal einloggt erstelle neue Daten in der DB
   */
  loadSave(uId: string, user?: IUser | null): Subject<ISave | null> {
    const saveSubject = new Subject<ISave | null>();

    this.database
      .object(`users/${uId}`)
      .valueChanges()
      .pipe(first())
      .subscribe((entry: any) => {
        if (entry) {
          let save = entry;
          save = this.checkSaveValidity(save, user);
          saveSubject.next(save);
          return;
        }
        saveSubject.next(null);
      });

    return saveSubject;
  }

  /**
   * Check if the User has some data locally if the database didn't have them
   * If some setting is missing add it to the user
   * @param save
   * @param user
   */
  checkSaveValidity(save: any, user?: any): ISave {
    let changedSave = false;
    if (user) {
      if (!save.collection) {
        save = { ...save, collection: user.save.collection };
        changedSave = true;
      }
      if (!save.decks) {
        save = { ...save, decks: user.save.decks };
        changedSave = true;
      }
      if (!save.settings) {
        save = { ...save, settings: user.save.settings };
        changedSave = true;
      }
      if (!save.uid) {
        save = { ...save, uid: user.uid };
        changedSave = true;
      }
      if (!save.displayName) {
        save = { ...save, displayName: user.displayName };
        changedSave = true;
      }
      if (!save.photoURL) {
        save = { ...save, photoURL: user.photoURL };
        changedSave = true;
      }
    } else {
      if (!save.collection) {
        save = { ...save, collection: [] };
        changedSave = true;
      }
      if (!save.decks) {
        save = { ...save, decks: [] };
        changedSave = true;
      }
      if (!save.settings) {
        save = { ...save, settings: emptySettings };
        changedSave = true;
      }
      if (!save.uid) {
        save = { ...save, uid: '' };
        changedSave = true;
      }
      if (!save.displayName) {
        save = { ...save, displayName: '' };
        changedSave = true;
      }
      if (!save.photoURL) {
        save = { ...save, photoURL: '' };
        changedSave = true;
      }
    }

    if (
      save.settings.cardSet === undefined ||
      save.settings.cardSet === 'Overwrite' ||
      +save.settings.cardSet >>> 0
    ) {
      save = { ...save, settings: { ...save.settings, cardSet: CARDSET.Both } };
      changedSave = true;
    }
    if (save.settings.collectionMinimum === undefined) {
      save = { ...save, settings: { ...save.settings, collectionMinimum: 1 } };
      changedSave = true;
    }
    if (save.settings.showPreRelease === undefined) {
      save = { ...save, settings: { ...save.settings, showPreRelease: true } };
      changedSave = true;
    }
    if (save.settings.showStampedCards === undefined) {
      save = {
        ...save,
        settings: { ...save.settings, showStampedCards: true },
      };
      changedSave = true;
    }
    if (save.settings.showAACards === undefined) {
      save = { ...save, settings: { ...save.settings, showAACards: true } };
      changedSave = true;
    }
    if (save.settings.showUserStats === undefined) {
      save = { ...save, settings: { ...save.settings, showUserStats: true } };
      changedSave = true;
    }

    if (changedSave && user?.uid) {
      this.setSave(user.uid, save);
    }
    return save;
  }

  setSave(uId: string, save: ISave) {
    const db = getDatabase();
    return update(ref(db, 'users/' + uId), save);
  }

  shareDeck(deck: IDeck, user: IUser | null) {
    const db = getDatabase();
    const newDeck = {
      ...deck,
      user: user?.displayName ?? 'Unknown',
      userId: user?.uid ?? 'Unknown',
      date: new Date(),
    };
    return update(ref(db, 'community-decks/' + deck.id), newDeck);
  }

  loadCommunityDecks(): BehaviorSubject<IDeck[]> {
    const deckSubject = new BehaviorSubject<IDeck[]>([]);

    this.database
      .list(`community-decks`)
      .valueChanges()
      .pipe(first())
      .subscribe((entry: any) => {
        if (!entry) return;

        deckSubject.next(entry as IDeck[]);
      });

    return deckSubject;
  }

  updateCommunityDeck(deck: IDeck) {
    const db = getDatabase();
    return update(ref(db, 'community-decks/' + deck.id), deck);
  }

  loadDeck(id: string): BehaviorSubject<IDeck> {
    const deckSubject = new BehaviorSubject<IDeck>(emptyDeck);

    this.database
      .object(`community-decks/` + id)
      .valueChanges()
      .pipe(first())
      .subscribe((entry: any) => {
        if (!entry) return;

        deckSubject.next(entry as IDeck);
      });

    return deckSubject;
  }

  deleteDeck(uId: string) {
    const db = getDatabase();
    return remove(ref(db, 'community-decks/' + uId));
  }

  loadChangelog(): Promise<any> {
    const db = getDatabase();
    return get(ref(db, 'blog/changelog-dev'));
  }

  saveChangelog(changelog: any) {
    const db = getDatabase();
    return update(ref(db, 'blog/changelog-dev'), changelog);
  }

  loadBlogEntries(): Observable<any> {
    const db = getDatabase();
    return from(get(ref(db, 'blog/entries')));
  }

  saveBlogEntry(blog: IBlog) {
    const db = getDatabase();
    return update(ref(db, 'blog/entries/' + blog.uid), blog);
  }

  deleteBlogEntry(blogId: string) {
    const db = getDatabase();
    return remove(ref(db, 'blog/entries/' + blogId));
  }
}
