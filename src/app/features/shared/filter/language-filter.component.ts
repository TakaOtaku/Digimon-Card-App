import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { SaveActions } from 'src/app/store/digimon.actions';
import { CARDSET } from '../../../../models';
import { selectCardSet } from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-language-filter',
  template: `
    <div *ngIf="cardSet$ | async as selectedCardSet" class="mb-3">
      <h1 class="text-center text-xs font-bold text-[#e2e4e6]">Language:</h1>
      <div class="flex inline-flex w-full justify-center">
        <button
          (click)="setCardSet(cardSet.English)"
          [ngClass]="{
            'bg-[#e2e4e6] text-black': selectedCardSet === cardSet.English,
            'surface-card text-[#e2e4e6]': selectedCardSet !== cardSet.English
          }"
          class="min-w-auto mt-2 h-8 w-20 rounded-l-sm border border-slate-100 p-2 text-xs font-semibold text-[#e2e4e6]">
          English
        </button>
        <button
          (click)="setCardSet(cardSet.Japanese)"
          [ngClass]="{
            'bg-[#e2e4e6] text-black': selectedCardSet === cardSet.Japanese,
            'surface-card text-[#e2e4e6]': selectedCardSet !== cardSet.Japanese
          }"
          class="min-w-auto mt-2 h-8 w-20 border border-slate-100 p-2 text-xs font-semibold text-[#e2e4e6]">
          日本語
        </button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgIf, NgClass, AsyncPipe],
})
export class LanguageFilterComponent {
  cardSet$ = this.store
    .select(selectCardSet)
    .pipe(map((set) => (+set >>> 0 ? CARDSET.English : set)));

  cardSet = CARDSET;

  constructor(private store: Store) {}

  setCardSet(cardSet: string) {
    this.store.dispatch(SaveActions.setCardSets({ cardSet }));
  }
}
