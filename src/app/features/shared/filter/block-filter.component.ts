import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { WebsiteActions } from 'src/app/store/digimon.actions';
import { BlockButtons } from '../../../../models';
import { selectBlockFilter } from '../../../store/digimon.selectors';
import { MultiButtonsComponent } from '../multi-buttons.component';

@Component({
  selector: 'digimon-block-filter',
  template: `
    <digimon-multi-buttons
      *ngIf="{ value: blockFilter$ | async } as blockFilter"
      (clickEvent)="changeBlock($event, blockFilter.value ?? [])"
      [buttonArray]="blockButtons"
      [value]="blockFilter.value"
      title="Block"></digimon-multi-buttons>
  `,
  standalone: true,
  imports: [NgIf, MultiButtonsComponent, AsyncPipe],
})
export class BlockFilterComponent {
  blockFilter$ = this.store.select(selectBlockFilter);

  blockButtons = BlockButtons;

  constructor(private store: Store) {}

  changeBlock(block: string, blockFilter: string[]) {
    let blocks = [];
    if (blockFilter && blockFilter.includes(block)) {
      blocks = blockFilter.filter((value) => value !== block);
    } else {
      blocks = [...new Set(blockFilter), block];
    }

    this.store.dispatch(WebsiteActions.setBlockFilter({ blockFilter: blocks }));
  }
}
