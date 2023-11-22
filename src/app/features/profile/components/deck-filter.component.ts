import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TAGS } from '../../../../models';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'digimon-deck-filter',
  template: `
    <div class="mx-auto my-1 flex max-w-6xl flex-row">
      <div class="my-1 flex w-full flex-col px-2">
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search h-3"></i>
          <input
            [formControl]="searchFilter"
            class="w-full text-xs"
            pInputText
            placeholder="Search (Title, Description, Card-Ids, Color)"
            type="text" />
        </span>
      </div>
      <p-multiSelect
        [formControl]="tagFilter"
        [options]="tags"
        [showToggleAll]="false"
        defaultLabel="Select a Tag"
        display="chip"
        scrollHeight="250px"
        class="mx-auto my-1 w-full max-w-[250px]"
        styleClass="w-full h-[34px] text-sm max-w-[250px]">
      </p-multiSelect>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    MultiSelectModule,
  ],
})
export class DeckFilterComponent {
  @Input() searchFilter: UntypedFormControl;
  @Input() tagFilter: UntypedFormControl;

  tags = TAGS;
}
