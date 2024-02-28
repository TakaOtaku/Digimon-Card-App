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
    <div class="mx-auto flex flex-row">
      <div class="flex w-full flex-col sm:pr-2">
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search h-3"></i>
          <input
            [formControl]="searchFilter"
            class="text-xs w-full"
            pInputText
            placeholder="Search (Title, Description, Card-Ids, Color)"
            type="text" />
        </span>
      </div>
      <p-multiSelect
        [formControl]="tagFilter"
        [options]="tags"
        [showToggleAll]="false"
        placeholder="Select a Tag"
        display="chip"
        scrollHeight="250px"
        class="mx-auto max-w-[250px]"
        styleClass="h-[34px] text-sm max-w-[250px]">
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
