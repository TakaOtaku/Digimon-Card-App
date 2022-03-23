import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {ISave} from "../models";
import {loadSave} from './store/digimon.actions';

@Component({
  selector: 'digimon-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(private store: Store) {
    this.loadSave();
  }

  private loadSave(): void {
    const item = localStorage.getItem('Digimon-Card-Collector');
    if (!item) return;
    const save: ISave = JSON.parse(item)
    this.store.dispatch(loadSave({save}));
  }
}
