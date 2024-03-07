import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { CARDSET } from '../../../../models';
import { SaveStore } from '../../../store/save.store';

@Component({
  selector: 'digimon-language-filter',
  template: `
    <div class="mb-3">
      <h1 class="text-center text-xs font-bold text-[#e2e4e6]">Language:</h1>
      <div class="inline-flex w-full justify-center">
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
  saveStore = inject(SaveStore);

  selectedCardSet = this.saveStore.settings().cardSet;

  cardSet = CARDSET;

  filterChange = effect(() => {
    this.selectedCardSet = this.saveStore.settings().cardSet;
  });

  setCardSet(cardSet: string) {
    const settings = this.saveStore.settings();
    this.saveStore.updateSettings({ ...settings, cardSet });
  }
}
