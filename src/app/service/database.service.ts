import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { get, getDatabase, ref, update } from '@angular/fire/database';

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
}
