import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FilterSideBoxComponent } from '../../shared/filter/filter-side-box.component';
import { PaginationCardListComponent } from './pagination-card-list.component';

@Component({
  selector: 'digimon-collection-view',
  template: `
    <div class="flex h-full flex-row overflow-x-hidden">
      <div class="2xl:w-8/10 hidden w-full md:block">
        <digimon-pagination-card-list [collectionOnly]="collectionOnly" [deckView]="deckView"></digimon-pagination-card-list>
      </div>
      <div class="2xl:w-2/10 hidden 2xl:flex">
        <digimon-filter-side-box></digimon-filter-side-box>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PaginationCardListComponent, FilterSideBoxComponent],
})
export class CollectionViewComponent {
  @Input() deckView: boolean;
  @Input() collectionOnly: boolean = false;
}
