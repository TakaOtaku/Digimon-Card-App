import { WebsiteActions } from './../../../store/digimon.actions';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { RarityButtons } from '../../../../models';
import { selectRarityFilter } from '../../../store/digimon.selectors';
import { MultiButtonsComponent } from '../multi-buttons.component';

@Component({
  selector: 'digimon-rarity-filter',
  template: `
    <digimon-multi-buttons
      *ngIf="{ value: rarityFilter$ | async } as rarityFilter"
      (clickEvent)="changeRarity($event, rarityFilter.value ?? [])"
      [buttonArray]="rarityButtons"
      [value]="rarityFilter.value"
      [perRow]="6"
      title="Rarity"></digimon-multi-buttons>
  `,
  standalone: true,
  imports: [NgIf, MultiButtonsComponent, AsyncPipe],
})
export class RarityFilterComponent {
  rarityFilter$ = this.store.select(selectRarityFilter);

  rarityButtons = RarityButtons;

  constructor(private store: Store) {}

  changeRarity(rarity: string, rarityFilter: string[]) {
    let rarities = [];
    if (rarityFilter && rarityFilter.includes(rarity)) {
      rarities = rarityFilter.filter((value) => value !== rarity);
    } else {
      rarities = [...new Set(rarityFilter), rarity];
    }

    this.store.dispatch(
      WebsiteActions.setrarityfilter({ rarityFilter: rarities })
    );
  }
}
