import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BlockButtons } from '../../../../models';
import { changeBlockFilter } from '../../../store/digimon.actions';
import { selectBlockFilter } from '../../../store/digimon.selectors';
import { MultiButtonsComponent } from '../multi-buttons.component';
import { NgIf, AsyncPipe } from '@angular/common';

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

    this.store.dispatch(changeBlockFilter({ blockFilter: blocks }));
  }
}
