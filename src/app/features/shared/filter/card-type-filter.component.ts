import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CardTypeButtons } from '../../../../models';
import { selectCardTypeFilter } from '../../../store/digimon.selectors';
import { MultiButtonsComponent } from '../multi-buttons.component';
import { WebsiteActions } from 'src/app/store/digimon.actions';

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
  standalone: true,
  imports: [NgIf, MultiButtonsComponent, AsyncPipe],
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

    this.store.dispatch(WebsiteActions.setcardtypefilter({ cardTypeFilter: types }));
  }
}
