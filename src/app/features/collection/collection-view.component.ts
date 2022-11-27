import { Component, Input } from "@angular/core";

@Component({
  selector: 'digimon-collection-view',
  template: `
    <div
      class="flex h-full max-h-full flex-row overflow-x-hidden overflow-y-scroll border border-slate-300"
    >
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
  styleUrls: ['collection-view.component.scss'],
})
export class CollectionViewComponent {
  @Input() deckView: boolean;
  @Input() collectionOnly: boolean = false;
}
