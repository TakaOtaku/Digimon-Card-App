import { Component, Input } from '@angular/core';
import { ICountCard, ISave } from '../../../models';

@Component({
  selector: 'digimon-user-stats',
  template: `
    <div class="flex flex-col border-2 border-slate-500 text-white lg:h-1/2">
      <div class="mx-auto grid h-1/2 grid-cols-2">
        <img
          class="min-w-auto h-full rounded-full rounded-full p-10 text-xs font-semibold text-white"
          *ngIf="save"
          alt="{{ save.displayName ?? 'Username not Found' }}"
          src="{{ save.photoURL }}"
        />

        <div
          class="vertical-align my-auto ml-10 text-center text-2xl font-bold"
        >
          {{ save?.displayName ?? 'User' }}
        </div>
      </div>
      <div class="grid grid-cols-4">
        <div class="flex flex-col">
          <digimon-collection-circle
            [collection]="collection"
            [type]="'BT'"
            class="mx-4"
          ></digimon-collection-circle>
          <label class="text-center">BT</label>
        </div>
        <div class="flex flex-col">
          <digimon-collection-circle
            [collection]="collection"
            [type]="'EX'"
            class="mx-4"
          ></digimon-collection-circle>
          <label class="text-center">EX</label>
        </div>
        <div class="flex flex-col">
          <digimon-collection-circle
            [collection]="collection"
            [type]="'ST'"
            class="mx-4"
          ></digimon-collection-circle>
          <label class="text-center">ST</label>
        </div>
        <div class="flex flex-col">
          <digimon-collection-circle
            [collection]="collection"
            [type]="'P'"
            class="mx-4"
          ></digimon-collection-circle>
          <label class="text-center">P</label>
        </div>
      </div>
    </div>
  `,
})
export class UserStatsComponent {
  @Input() save: ISave | null;
  @Input() collection: ICountCard[];
}
