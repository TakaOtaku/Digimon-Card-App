import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {CookieService} from "ngx-cookie-service";
import {ISave} from "./models";
import {loadSave} from './store/digimon.actions';

@Component({
  selector: 'digimon-root',
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
    const save = localStorage.getItem('Digimon-Card-Collector');
    if (save) {
      const save: ISave = JSON.parse(localStorage.getItem('Digimon-Card-Collector')!)
      this.store.dispatch(loadSave({save}));
    }
  }
}
