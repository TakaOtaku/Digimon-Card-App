import { NgClass } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { CARDSET } from '../../../../models';
import { SaveStore } from '../../../store/save.store';

@Component({
  selector: 'digimon-language-filter',
  template: `
    <div class="mb-3">
      <h2 class="text-center text-xs font-bold text-fg">Language:</h2>
      <div class="inline-flex w-full justify-center">
        <button
          (click)="setCardSet(cardSet.English)"
          [ngClass]="{
            'button-highlight-background text-white': selectedCardSet === cardSet.English,
            'surface-card text-fg': selectedCardSet !== cardSet.English,
          }"
          class="min-w-auto mt-2 h-8 w-20 rounded-l-sm border border-slate-100 p-2 text-xs font-semibold text-fg">
          English
        </button>
        <button
          (click)="setCardSet(cardSet.Japanese)"
          [ngClass]="{
            'button-highlight-background text-white': selectedCardSet === cardSet.Japanese,
            'surface-card text-fg': selectedCardSet !== cardSet.Japanese,
          }"
          class="min-w-auto mt-2 h-8 w-20 border border-slate-100 p-2 text-xs font-semibold text-fg">
          日本語
        </button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgClass],
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
