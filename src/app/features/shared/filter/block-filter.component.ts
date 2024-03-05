import { AsyncPipe, NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { BlockButtons } from '../../../../models';
import { FilterStore } from '../../../store/filter.store';
import { MultiButtonsComponent } from '../multi-buttons.component';

@Component({
  selector: 'digimon-block-filter',
  template: `
    <digimon-multi-buttons
      (clickEvent)="changeBlock($event, blockFilter)"
      [buttonArray]="blockButtons"
      [value]="blockFilter"
      title="Block"></digimon-multi-buttons>
  `,
  standalone: true,
  imports: [NgIf, MultiButtonsComponent, AsyncPipe],
})
export class BlockFilterComponent {
  filterStore = inject(FilterStore);
  blockFilter: string[] = this.filterStore.blockFilter();

  blockButtons = BlockButtons;

  filterChange = effect(() => {
    this.blockFilter = this.filterStore.blockFilter();
  });

  changeBlock(block: string, blockFilter: string[]) {
    let blocks = [];
    if (blockFilter && blockFilter.includes(block)) {
      blocks = blockFilter.filter((value) => value !== block);
    } else {
      blocks = [...new Set(blockFilter), block];
    }

    this.filterStore.updateBlockFilter(blocks);
  }
}
