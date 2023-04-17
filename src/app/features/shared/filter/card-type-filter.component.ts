import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CardTypeButtons } from '../../../../models';
import { changeCardTypeFilter } from '../../../store/digimon.actions';
import { selectCardTypeFilter } from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-card-type-filter',
  template: `
    <digimon-multi-buttons
      *ngIf="{ value: cardTypeFilter$ | async } as cardTypeFilter"
      (clickEvent)="changeCardType($event, cardTypeFilter.value ?? [])"
      [buttonArray]="cardTypeButtons"
      [value]="cardTypeFilter.value"
      [perRow]="4"
      title="Card-Types"></digimon-multi-buttons>
  `,
})
export class CardTypeFilterComponent {
  cardTypeFilter$ = this.store.select(selectCardTypeFilter);

  cardTypeButtons = CardTypeButtons;
  constructor(private store: Store) {}

  changeCardType(type: string, cardTypeFilter: string[]) {
    let types = [];
    if (cardTypeFilter && cardTypeFilter.includes(type)) {
      types = cardTypeFilter.filter((value) => value !== type);
    } else {
      types = [...new Set(cardTypeFilter), type];
    }

    this.store.dispatch(changeCardTypeFilter({ cardTypeFilter: types }));
  }
}
