import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButton } from 'primeng/splitbutton';
import { ISort } from '../../../models';
import { WebsiteStore } from '../../store/website.store';

@Component({
  selector: 'digimon-sort-buttons',
  template: `
    <div class="mb-1 inline-flex rounded-md shadow-sm" role="group">
      @if (sort.ascOrder) {
        <p-splitbutton
          [label]="sortElement.name"
          icon="pi pi-sort-amount-down"
          (onClick)="changeOrder()"
          (onDropdownClick)="updateStore($event)"
          [model]="sortOptions"
          raised
          text
          size="small" />
      } @else {
        <p-splitbutton [label]="sortElement.name" icon="pi pi-sort-amount-up" (onClick)="changeOrder()" [model]="sortOptions" raised text />
      }
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, DropdownModule, FormsModule, ReactiveFormsModule, SplitButton],
})
export class SortButtonsComponent {
  websiteStore = inject(WebsiteStore);
  sortElement = { name: 'ID', element: 'id' };
  sort: ISort = this.websiteStore.sort();

  sortOptions: MenuItem[] = [
    { label: 'ID', id: 'id' },
    { label: 'Cost', id: 'playCost' },
    { label: 'DP', id: 'dp' },
    { label: 'Level', id: 'cardLv' },
    { label: 'Name', id: 'name' },
  ];

  updateStore($event: any) {
    debugger;
    this.websiteStore.updateSort({ sortBy: this.sortElement, ascOrder: this.sort.ascOrder });
  }

  changeOrder() {
    const ascOrder = !this.sort.ascOrder;
    this.websiteStore.updateSort({ ...this.sort, ascOrder });
  }
}
