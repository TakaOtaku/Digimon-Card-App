import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {ISave, IUser} from "../../models";
import {AuthService} from "./auth.service";


@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private users: AngularFireList<ISave>;

  constructor(private authService: AuthService, db: AngularFireDatabase) {
    const test = db.list('users');
  }

  /**
   * Falls der Nutzer eingeloggt ist und keine Daten hat, erstelle diese
   * Falls der Nutzer sich zum ersten mal einloggt erstelle neue Daten in der DB
   */
  loadSave(user: IUser|null) {
    return null;
  }
}
