import { AsyncPipe, NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { RarityButtons } from '../../../../models';
import { FilterStore } from '../../../store/filter.store';
import { MultiButtonsComponent } from '../multi-buttons.component';

@Component({
  selector: 'digimon-rarity-filter',
  template: `
    <digimon-multi-buttons
      (clickEvent)="changeRarity($event, rarityFilter)"
      [buttonArray]="rarityButtons"
      [value]="rarityFilter"
      [perRow]="6"
      title="Rarity"></digimon-multi-buttons>
  `,
  standalone: true,
  imports: [NgIf, MultiButtonsComponent, AsyncPipe],
})
export class RarityFilterComponent {
  filterStore = inject(FilterStore);
  rarityFilter: string[] = this.filterStore.rarityFilter();

  rarityButtons = RarityButtons;

  filterChange = effect(() => {
    this.rarityFilter = this.filterStore.rarityFilter();
  });

  changeRarity(rarity: string, rarityFilter: string[]) {
    let rarities = [];
    if (rarityFilter && rarityFilter.includes(rarity)) {
      rarities = rarityFilter.filter((value) => value !== rarity);
    } else {
      rarities = [...new Set(rarityFilter), rarity];
    }

    this.filterStore.updateRarityFilter(rarities);
  }
}
