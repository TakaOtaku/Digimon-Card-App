import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'digimon-collection-view',
  template: `
    <div class="flex h-full flex-row overflow-x-hidden border border-slate-200">
      <div class="2xl:w-8/10 hidden w-full md:block">
        <digimon-pagination-card-list
          [collectionOnly]="collectionOnly"
          [deckView]="deckView"
        ></digimon-pagination-card-list>
      </div>
      <div class="2xl:w-2/10 hidden 2xl:flex">
        <digimon-filter-side-box></digimon-filter-side-box>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionViewComponent {
  @Input() deckView: boolean;
  @Input() collectionOnly: boolean = false;
}
