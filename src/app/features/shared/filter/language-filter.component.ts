import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { CARDSET } from '../../../../models';
import { changeCardSets } from '../../../store/digimon.actions';
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
        <button
          (click)="setCardSet(cardSet.Both)"
          [ngClass]="{
            'bg-[#e2e4e6] text-black': selectedCardSet === cardSet.Both,
            'surface-card text-[#e2e4e6]': selectedCardSet !== cardSet.Both
          }"
          class="min-w-auto mt-2 h-8 w-20 rounded-r-sm border border-slate-100 p-2 text-xs font-semibold text-[#e2e4e6]">
          Both
        </button>
      </div>
    </div>
  `,
})
export class LanguageFilterComponent {
  cardSet$ = this.store.select(selectCardSet).pipe(map((set) => (+set >>> 0 ? CARDSET.Both : set)));

  cardSet = CARDSET;

  constructor(private store: Store) {}

  setCardSet(cardSet: string) {
    this.store.dispatch(changeCardSets({ cardSet }));
  }
}
