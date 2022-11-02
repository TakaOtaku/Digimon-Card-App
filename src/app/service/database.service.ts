import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { get, getDatabase, ref, update } from '@angular/fire/database';
import { BehaviorSubject, first, from, Observable } from 'rxjs';
import { IDeck } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(public database: AngularFireDatabase) {}

  loadChangelog(): Promise<any> {
    const db = getDatabase();
    return get(ref(db, 'blog/changelog'));
  }

  saveChangelog(changelog: any) {
    const db = getDatabase();
    return update(ref(db, 'blog/changelog'), { text: changelog });
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

  loadBlogEntries(): Observable<any> {
    const db = getDatabase();
    return from(get(ref(db, 'blog/entries')));
  }

  loadBlogText(): Observable<any> {
    const db = getDatabase();
    return from(get(ref(db, 'blog/text')));
  }

  loadUsers(): Observable<any> {
    const db = getDatabase();
    return from(get(ref(db, 'users')));
  }
}
