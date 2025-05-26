import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(public database: AngularFireDatabase) {}

  loadChangelog(): Observable<any> {
    return this.database.object('blog/changelog').valueChanges();
  }

  saveChangelog(changelog: any) {
    return this.database.object('blog/changelog').update({ text: changelog });
  }
}
