import { Component, inject } from '@angular/core';
import { WebsiteStore } from '../../../store/website.store';

@Component({
  selector: 'digimon-filter-button',
  template: `
    <button
      (click)="setMobileCollectionView()"
      class="min-w-auto primary-background ml-2 mt-2 h-8 w-32 rounded p-2 text-xs font-semibold text-[#e2e4e6]">
      Card-List
    </button>
  `,
  standalone: true,
})
export class FilterButtonComponent {
  websiteStore = inject(WebsiteStore);

  setMobileCollectionView() {
    const mobileCollectionView = this.websiteStore.mobileCollectionView();
    this.websiteStore.updateMobileCollectionView(!mobileCollectionView);
  }
}
