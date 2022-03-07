import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {CookieService} from "ngx-cookie-service";
import {ISave} from "./models";
import {loadSave} from './store/actions/save.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private cookies: CookieService,
    private store: Store
  ) {
    this.loadSave();
  }

  private loadSave(): void {
    if (this.cookies.check('Digimon-Card-Collector')) {
      const cookie = this.cookies.get('Digimon-Card-Collector');
      const save: ISave = JSON.parse(cookie);
      this.store.dispatch(loadSave({save}));
    }
  }
}
