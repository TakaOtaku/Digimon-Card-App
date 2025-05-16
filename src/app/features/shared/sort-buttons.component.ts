import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
          [label]="sortElement().name"
          icon="pi pi-sort-amount-down"
          (onClick)="changeOrder()"
          [model]="sortOptions"
          raised
          text
          size="small" />
      } @else {
        <p-splitbutton
          [label]="sortElement().name"
          icon="pi pi-sort-amount-down"
          (onClick)="changeOrder()"
          [model]="sortOptions"
          raised
          text
          size="small" />
      }
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropdownModule, FormsModule, ReactiveFormsModule, SplitButton],
})
export class SortButtonsComponent {
  websiteStore = inject(WebsiteStore);
  sortElement = signal({ name: 'ID', element: 'id' });
  sort: ISort = this.websiteStore.sort();

  sortOptions: MenuItem[] = [
    {
      label: 'ID',
      command: () => {
        this.sortElement.set({ name: 'ID', element: 'id' });
        this.updateStore();
      },
    },
    {
      label: 'Cost',
      command: () => {
        this.sortElement.set({ name: 'Cost', element: 'playCost' });
        this.updateStore();
      },
    },
    {
      label: 'DP',
      command: () => {
        this.sortElement.set({ name: 'DP', element: 'dp' });
        this.updateStore();
      },
    },
    {
      label: 'Level',
      command: () => {
        this.sortElement.set({ name: 'Level', element: 'cardLv' });
        this.updateStore();
      },
    },
    {
      label: 'Name',
      command: () => {
        this.sortElement.set({ name: 'Name', element: 'name' });
        this.updateStore();
      },
    },
  ];

  updateStore() {
    this.websiteStore.updateSort({ sortBy: this.sortElement(), ascOrder: this.sort.ascOrder });
  }

  changeOrder() {
    const ascOrder = !this.sort.ascOrder;
    console.log(ascOrder);
    this.websiteStore.updateSort({ sortBy: this.sortElement(), ascOrder });
  }
}
