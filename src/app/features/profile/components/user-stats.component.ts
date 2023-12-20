import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ISave } from '../../../../models';
import { CollectionPriceCheckDialogComponent } from './collection-price-check-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { CollectionCircleComponent } from './collection-circle.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'digimon-user-stats',
  template: `
    <div class="flex flex-col py-2 text-[#e2e4e6]">
      <div class="flex flex-col sm:flex-row justify-center">
        <div class="flex flex-row mr-5">
          <img
            class="my-auto mr-2 h-16 w-auto rounded-full text-xs font-semibold text-[#e2e4e6]"
            *ngIf="save"
            alt="{{ save.displayName ?? 'Username not Found' }}"
            src="{{ save.photoURL }}" />
          <div class="vertical-align my-auto text-center text-2xl font-bold">
            {{ save.displayName ?? 'User' }}
          </div>
        </div>

        <div class="flex flex-row justify-center">
          <div class="flex flex-col">
            <digimon-collection-circle
              [collection]="save.collection"
              [type]="'BT'"
              class="mx-2"></digimon-collection-circle>
            <label class="text-center">BT</label>
          </div>
          <div class="flex flex-col">
            <digimon-collection-circle
              [collection]="save.collection"
              [type]="'EX'"
              class="mx-2"></digimon-collection-circle>
            <label class="text-center">EX</label>
          </div>
          <div class="flex flex-col">
            <digimon-collection-circle
              [collection]="save.collection"
              [type]="'ST'"
              class="mx-2"></digimon-collection-circle>
            <label class="text-center">ST</label>
          </div>
          <div class="flex flex-col">
            <digimon-collection-circle
              [collection]="save.collection"
              [type]="'P-'"
              class="mx-2"></digimon-collection-circle>
            <label class="text-center">P</label>
          </div>
        </div>
      </div>

      <div class="flex flex-row w-full">
        <button
          (click)="viewCollectionDialog = true"
          class="surface-ground hover:primary-background text-shadow border flex-grow border-black p-2 font-bold text-[#e2e4e6]">
          View Collection
        </button>
        <button
          (click)="priceCheckDialog = true"
          class="surface-ground hover:primary-background text-shadow border flex-grow border-black p-2 font-bold text-[#e2e4e6]">
          Collection Worth
        </button>
      </div>
    </div>

    <p-dialog
      header="Price Check"
      [(visible)]="priceCheckDialog"
      styleClass="w-[100%] min-w-[250px] sm:min-w-[500px] sm:w-[900px] lg:w-[1024px] 2xl:w-[1536px] min-h-[500px]"
      [baseZIndex]="10000"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false">
      <digimon-collection-price-check-dialog
        [save]="save"></digimon-collection-price-check-dialog>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    CollectionCircleComponent,
    DialogModule,
    CollectionPriceCheckDialogComponent,
  ],
})
export class UserStatsComponent {
  @Input() save: ISave;

  priceCheckDialog = false;
  viewCollectionDialog = false;
}
